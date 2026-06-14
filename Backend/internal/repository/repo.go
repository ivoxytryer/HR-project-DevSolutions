package repository

import (
	"github.com/jmoiron/sqlx"
)

type Repository struct{ DB *sqlx.DB }

func (r *Repository) GetEntities(query string, dest interface{}) error {
	return r.DB.Select(dest, query)
}
