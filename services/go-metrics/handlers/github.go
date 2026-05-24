package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

type githubUser struct {
	PublicRepos int    `json:"public_repos"`
	Followers   int    `json:"followers"`
	Following   int    `json:"following"`
	Name        string `json:"name"`
	Bio         string `json:"bio"`
	AvatarURL   string `json:"avatar_url"`
	HTMLURL     string `json:"html_url"`
}

type githubRepo struct {
	Name            string `json:"name"`
	Description     string `json:"description"`
	StargazersCount int    `json:"stargazers_count"`
	ForksCount      int    `json:"forks_count"`
	Language        string `json:"language"`
	HTMLURL         string `json:"html_url"`
	UpdatedAt       string `json:"updated_at"`
}

func GitHubStats(c *gin.Context) {
	username := c.Param("username")
	client := &http.Client{Timeout: 10 * time.Second}

	user, err := fetchGitHubUser(client, username)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "failed to fetch GitHub profile"})
		return
	}

	repos, err := fetchTopRepos(client, username)
	if err != nil {
		repos = []githubRepo{}
	}

	c.JSON(http.StatusOK, gin.H{
		"profile":   user,
		"top_repos": repos,
		"fetched_at": time.Now().UTC().Format(time.RFC3339),
	})
}

func CICDStatus(c *gin.Context) {
	owner := os.Getenv("GITHUB_USERNAME")
	repo  := os.Getenv("GITHUB_REPO")
	token := os.Getenv("GITHUB_TOKEN")

	if owner == "" || repo == "" {
		c.JSON(http.StatusOK, gin.H{"status": "not_configured"})
		return
	}

	client := &http.Client{Timeout: 10 * time.Second}
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/actions/runs?per_page=5", owner, repo)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "github unreachable"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode error"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func fetchGitHubUser(client *http.Client, username string) (*githubUser, error) {
	req, _ := http.NewRequest("GET", "https://api.github.com/users/"+username, nil)
	addGitHubHeaders(req)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var user githubUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

func fetchTopRepos(client *http.Client, username string) ([]githubRepo, error) {
	url := fmt.Sprintf(
		"https://api.github.com/users/%s/repos?sort=updated&per_page=6&type=owner",
		username,
	)
	req, _ := http.NewRequest("GET", url, nil)
	addGitHubHeaders(req)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var repos []githubRepo
	if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
		return nil, err
	}
	return repos, nil
}

func addGitHubHeaders(req *http.Request) {
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	if token := os.Getenv("GITHUB_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
}
