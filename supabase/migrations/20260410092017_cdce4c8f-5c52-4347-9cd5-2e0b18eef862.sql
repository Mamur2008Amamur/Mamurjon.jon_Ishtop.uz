
DROP POLICY "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (
  length(name) > 0 AND length(name) <= 100
  AND length(email) > 0 AND length(email) <= 255
  AND length(message) > 0 AND length(message) <= 1000
);
