
-- Allow public read access to all help requests (for admin panel)
CREATE POLICY "Anyone can read all help requests"
ON public.help_requests
FOR SELECT
TO public
USING (true);

-- Allow public update of status on help requests
CREATE POLICY "Anyone can update help request status"
ON public.help_requests
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow public read access to all help request images
CREATE POLICY "Anyone can read all help request images"
ON public.help_request_images
FOR SELECT
TO public
USING (true);

-- Allow anonymous inserts to help_requests (no auth required)
CREATE POLICY "Anyone can insert help requests"
ON public.help_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anonymous inserts to help_request_images
CREATE POLICY "Anyone can insert help request images"
ON public.help_request_images
FOR INSERT
TO public
WITH CHECK (true);
