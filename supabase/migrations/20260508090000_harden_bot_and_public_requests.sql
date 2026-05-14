-- Keep public help requests from failing when the visitor is not logged in.
ALTER TABLE public.help_requests
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.help_requests
  DROP CONSTRAINT IF EXISTS help_requests_status_check;

ALTER TABLE public.help_requests
  ADD CONSTRAINT help_requests_status_check
  CHECK (status IN ('new', 'in_progress', 'resolved', 'done', 'cancelled'));

-- Let anonymous visitors attach images to help requests created from the public site.
CREATE POLICY "Anyone can upload help images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'help-images');
