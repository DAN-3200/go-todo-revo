package db

import (
	"database/sql"
	"os"
	"path/filepath"
	"sync"

	_ "modernc.org/sqlite"
)

var (
	DB   *sql.DB
	once sync.Once
)

func GetDB() *sql.DB {
	once.Do(func() {
		dataDir, err := os.UserConfigDir()
		if err != nil {
			panic("failed to get user config dir: " + err.Error())
		}

		appDir := filepath.Join(dataDir, "db-go-lemure")
		if err := os.MkdirAll(appDir, 0o755); err != nil {
			panic("failed to create app dir: " + err.Error())
		}

		dbPath := filepath.Join(appDir, "database.db")

		db, err := sql.Open("sqlite", dbPath)
		if err != nil {
			panic("failed to open database: " + err.Error())
		}

		if err := db.Ping(); err != nil {
			panic("failed to connect to database: " + err.Error())
		}

		DB = db
	})

	return DB
}
