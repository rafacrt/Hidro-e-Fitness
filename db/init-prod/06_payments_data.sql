INSERT INTO "public"."payments" ("id", "student_id", "amount", "payment_date", "payment_method", "status", "created_at") VALUES
('2', null, '-776.05', '2025-08-13', 'PIX', 'pago', '2025-08-13 10:26:15.510849+00'),
('3', null, '-5445.87', '2025-08-13', 'PIX', 'pendente', '2025-08-13 10:58:43.315439+00')
ON CONFLICT (id) DO NOTHING;