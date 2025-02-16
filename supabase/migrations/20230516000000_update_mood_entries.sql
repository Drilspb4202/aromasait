-- Update the mood_entries table
ALTER TABLE mood_entries
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('russian', coalesce(mood::text, ''))
) STORED;

-- Create an index for faster searching
CREATE INDEX mood_entries_search_idx ON mood_entries USING GIN (search_vector);

-- Add a trigger to update the search_vector when mood is updated
CREATE FUNCTION mood_entries_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('russian', coalesce(NEW.mood::text, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER mood_entries_search_update
BEFORE INSERT OR UPDATE ON mood_entries
FOR EACH ROW
EXECUTE FUNCTION mood_entries_search_update();

