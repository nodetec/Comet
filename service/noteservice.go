package service

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/nodetec/captains-log/db"
)

type NoteService struct {
	queries *db.Queries
	logger  *log.Logger
}

func NewNoteService(queries *db.Queries, logger *log.Logger) *NoteService {
	return &NoteService{
		queries: queries,
		logger:  logger,
	}
}

func (s *NoteService) CreateNote(ctx context.Context, params db.CreateNoteParams) (db.Note, error) {
	note, err := s.queries.CreateNote(ctx, params)
	if err != nil {
		s.logger.Println("Error creating note:", err)
		return db.Note{}, err
	}
	return note, nil
}

func (s *NoteService) GetNote(ctx context.Context, id int64) (db.Note, error) {
	note, err := s.queries.GetNote(ctx, id)
	if err != nil {
		s.logger.Println("Error getting note:", err)
		return db.Note{}, err
	}
	return note, nil
}

func (s *NoteService) ListNotes(ctx context.Context, limit, pageParam int64) ([]db.Note, error) {
	offset := pageParam * limit
	notes, err := s.queries.ListNotes(ctx, db.ListNotesParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		s.logger.Println("Error listing notes:", err)
		return []db.Note{}, err
	}
	return notes, nil
}

func (s *NoteService) UpdateNote(ctx context.Context, params db.UpdateNoteParams) error {
	err := s.queries.UpdateNote(ctx, params)
	if err != nil {
		s.logger.Println("Error updating note:", err)
		return err
	}
	return nil
}

func (s *NoteService) DeleteNote(ctx context.Context, id int64) error {
	err := s.queries.DeleteNote(ctx, id)
	if err != nil {
		s.logger.Println("Error deleting note:", err)
		return err
	}
	return nil
}

// Trash-related methods

func (s *NoteService) AddNoteToTrash(ctx context.Context, note db.Note, tags []db.Tag) error {

	var builder strings.Builder

	for i, tag := range tags {
		if i > 0 {
			builder.WriteString(",")
		}
		builder.WriteString(tag.Name)
	}

	stringifiedTags := builder.String()

	params := db.AddNoteToTrashParams{
		NoteID:    sql.NullInt64{Int64: note.ID, Valid: true},
		Content:   note.Content,
		Title:     note.Title,
		CreatedAt: note.CreatedAt,
		TrashedAt: time.Now().Format(time.RFC3339),
		Tags:      sql.NullString{String: stringifiedTags, Valid: true},
	}
	_, err := s.queries.AddNoteToTrash(ctx, params)
	if err != nil {
		s.logger.Printf("Error adding note to trash: %v", err)
		return err
	}
	return nil
}

func (s *NoteService) GetNoteFromTrash(ctx context.Context, id int64) (db.Trash, error) {
	trash, err := s.queries.GetNoteFromTrash(ctx, id)
	if err != nil {
		s.logger.Printf("Error getting note from trash with ID %d: %v", id, err)
		return db.Trash{}, err
	}
	return trash, nil
}

func (s *NoteService) ListNotesFromTrash(ctx context.Context, limit, pageParam int64) ([]db.Trash, error) {
	offset := pageParam * limit
	trash, err := s.queries.ListNotesFromTrash(ctx, db.ListNotesFromTrashParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		s.logger.Printf("Error listing notes from trash: %v", err)
		return nil, err
	}
	return trash, nil
}

func (s *NoteService) DeleteNoteFromTrash(ctx context.Context, id int64) error {
	err := s.queries.DeleteNoteFromTrash(ctx, id)
	if err != nil {
		s.logger.Printf("Error deleting note from trash with ID %d: %v", id, err)
		return err
	}
	return nil
}

func (s *NoteService) ListNotesByNotebook(ctx context.Context, notebookID int64, limit, pageParam int64) ([]db.Note, error) {
	offset := pageParam * limit
	notes, err := s.queries.ListNotesByNotebook(ctx, db.ListNotesByNotebookParams{
		NotebookID: sql.NullInt64{Int64: notebookID, Valid: true},
		Limit:      limit,
		Offset:     offset,
	})
	if err != nil {
		s.logger.Println("Error listing notes by notebook:", err)
		return []db.Note{}, err
	}
	return notes, nil
}
