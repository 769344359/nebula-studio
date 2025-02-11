package config

import (
	"os"
	"path/filepath"
	"reflect"

	"github.com/zeromicro/go-zero/rest"
)

var configIns *Config

var PromptTemplate = `As a knowledge graph AI importer, your task is to extract useful data from the following text:` +
	"```text\n" +
	`{text}` +
	"\n```\n" +
	`the knowledge graph has following schema and node name must be a real :` +
	"```graph-schema\n" +
	`{spaceSchema}` +
	"\n```\n" +
	`{userPrompt}
    Return the results directly, without explain and comment. The results should be in the following JSON format:
    {
      "nodes":[{ "name":string,"type":string,"props":object }],
      "edges":[{ "src":string,"dst":string,"edgeType":string,"props":object }]
    }
    The name of the nodes should be an actual object and a noun.
    Result:`

func GetConfig() *Config {
	return configIns
}

type Config struct {
	rest.RestConf
	AppInstance string `json:",default=single"`
	Debug       struct {
		Enable bool
	}
	Auth struct {
		TokenName    string
		AccessSecret string
		AccessExpire int64
	}
	CorsOrigins []string `json:",optional"`
	File        struct {
		UploadDir string
		TasksDir  string
	} `json:",optional"`

	WebSocket struct {
		// The maximum wait time (secend) for the pong message from peer.
		// If a peer does not respond to the ping message within this time, websocket will close the connection.
		// default 60s, 0 means no limit
		WriteDeadline int64 `json:",default=60"`
		// The maximum wait time (secend) for the ping message from peer.
		// If a peer does not send a ping message within this time, websocket will close the connection.
		// default 60s, 0 means no limit
		ReadDeadline int64 `json:",default=60"`
		// The maximum message size allowed from peer.
		// If a peer sends a message larger than this, a `websocket: write limit exceeded` error will be returned.
		// default: 32MB (32 * 1024 * 1024), 0 means no limit or system limit
		WriteLimit int64 `json:",default=33554432"`
		// The maximum message size allowed from peer.
		// If a peer sends a message larger than this, websocket will close the connection.
		// default: 8MB (8 * 1024 * 1024), 0 means no limit or system limit
		ReadLimit int64 `json:",default=8388608"`
	} `json:",optional"`

	DB struct {
		LogLevel                  int    `json:",default=4"`
		IgnoreRecordNotFoundError bool   `json:",default=true"`
		AutoMigrate               bool   `json:",default=true"`
		Type                      string `json:",default=sqlite3"`
		Host                      string `json:",optional"`
		Name                      string `json:",optional"`
		User                      string `json:",optional"`
		Password                  string `json:",optional"`
		SqliteDbFilePath          string `json:",default=./data/tasks.db"`
		MaxOpenConns              int    `json:",default=30"`
		MaxIdleConns              int    `json:",default=10"`
	}

	LLM struct {
		GQLPath        string `json:",default=./data/llm"`
		GQLBatchSize   int    `json:",default=100"`
		MaxBlockSize   int    `json:",default=0"`
		PromptTemplate string `json:",default="`
	}
}

type PathValidator struct {
	Type        string // folder | file
	StructAttr  string
	DefaultPath string
}

func (c *Config) Validate() error {
	return nil
}

func (c *Config) Complete() {
	fileValidatorList := []PathValidator{
		{Type: "folder", StructAttr: "UploadDir", DefaultPath: "data/upload"},
		{Type: "folder", StructAttr: "TasksDir", DefaultPath: "data/tasks"},
		{Type: "file", StructAttr: "SqliteDbFilePath", DefaultPath: "data/tasks.db"},
	}

	fileRefVal := reflect.ValueOf(&c.File).Elem()

	for _, v := range fileValidatorList {
		pathRef := fileRefVal.FieldByName(v.StructAttr)

		if !pathRef.IsValid() {
			break
		}

		if pathRef.String() == "" {
			pathRef.SetString(v.DefaultPath)
		}

		abs, _ := filepath.Abs(pathRef.String())

		if _, err := os.Stat(abs); os.IsNotExist(err) {
			if v.Type == "folder" {
				os.MkdirAll(abs, os.ModePerm)
			} else if v.Type == "file" {
				if _, err := os.Stat(filepath.Dir(abs)); os.IsNotExist(err) {
					os.MkdirAll(filepath.Dir(abs), os.ModePerm)
				}
				os.WriteFile(abs, []byte(""), os.ModePerm)
			}
		}
	}
	if c.LLM.MaxBlockSize == 0 {
		c.LLM.MaxBlockSize = 1024 * 1024 * 1024
	}
	if c.LLM.PromptTemplate == "" {
		c.LLM.PromptTemplate = PromptTemplate
	}
}

func (c *Config) InitConfig() error {
	c.Complete()

	configIns = c

	return c.Validate()
}
