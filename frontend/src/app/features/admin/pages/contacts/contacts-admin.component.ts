import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { Contact } from '../../../../core/models';

@Component({
  selector: 'app-contacts-admin',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-white">
        Messages
        @if (unread() > 0) {
          <span class="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-sm font-mono rounded-full">{{ unread() }} new</span>
        }
      </h1>
    </div>

    @if (selected()) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface-card border border-surface-border rounded-xl w-full max-w-lg p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-white font-semibold">{{ selected()!.name }}</h2>
              <p class="text-slate-400 text-sm">{{ selected()!.email }}</p>
            </div>
            <button (click)="selected.set(null)" class="text-slate-400 hover:text-white p-1">✕</button>
          </div>
          @if (selected()!.subject) {
            <div class="text-slate-300 font-medium mb-3">{{ selected()!.subject }}</div>
          }
          <div class="text-slate-400 text-sm leading-relaxed bg-surface rounded-lg p-4 whitespace-pre-wrap">{{ selected()!.message }}</div>
          <div class="text-slate-600 text-xs mt-4">{{ selected()!.createdAt | date:'medium' }}</div>
          <div class="flex gap-3 mt-6">
            <a [href]="'mailto:' + selected()!.email + '?subject=Re: ' + (selected()!.subject || 'Your message')"
               class="btn-primary text-sm">Reply via Email</a>
            <button (click)="selected.set(null)" class="btn-outline text-sm">Close</button>
          </div>
        </div>
      </div>
    }

    <div class="space-y-2">
      @for (c of contacts(); track c.id) {
        <div (click)="open(c)" [ngClass]="!c.read ? 'border-primary/30 bg-primary/5' : ''"
             class="card cursor-pointer hover:border-primary/40 transition-all">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                @if (!c.read) { <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span> }
                <span class="text-white font-medium text-sm">{{ c.name }}</span>
                <span class="text-slate-500 text-xs hidden sm:inline">· {{ c.email }}</span>
              </div>
              @if (c.subject) { <div class="text-slate-300 text-sm mt-1">{{ c.subject }}</div> }
              <p class="text-slate-500 text-xs mt-1 truncate">{{ c.message }}</p>
            </div>
            <div class="text-slate-600 text-xs shrink-0">{{ c.createdAt | date:'shortDate' }}</div>
          </div>
        </div>
      }
      @if (contacts().length === 0 && !loading()) {
        <div class="text-center py-16 text-slate-500">No messages yet.</div>
      }
    </div>
  `,
})
export class ContactsAdminComponent extends ApiService implements OnInit {
  loading = signal(true);
  contacts = signal<Contact[]>([]);
  selected = signal<Contact | null>(null);
  unread = signal(0);

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any>(this.url('/contact?size=50')).subscribe(p => {
      this.contacts.set(p.content);
      this.unread.set(p.content.filter((c: Contact) => !c.read).length);
      this.loading.set(false);
    });
  }

  open(c: Contact) {
    this.selected.set(c);
    if (!c.read) {
      this.http.patch(this.url(`/contact/${c.id}/read`), {}).subscribe(() => {
        c.read = true;
        this.unread.update(n => Math.max(0, n - 1));
      });
    }
  }
}
