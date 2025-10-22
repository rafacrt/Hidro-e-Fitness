--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.profiles DISABLE TRIGGER ALL;

INSERT INTO public.profiles (id, full_name, avatar_url, role) VALUES ('07827a3b-75e4-47b3-a15a-b26121d3e873', 'Teste', NULL, 'user');
INSERT INTO public.profiles (id, full_name, avatar_url, role) VALUES ('480bd3ca-1809-44d1-8855-8dc2957f695c', 'Rafael Medeiros', '/storage/avatars/480bd3ca-1809-44d1-8855-8dc2957f695c/480bd3ca-1809-44d1-8855-8dc2957f695c-0.38845846306873355.jpg', 'Desenvolvedor');
INSERT INTO public.profiles (id, full_name, avatar_url, role) VALUES ('d811be5b-bd9d-41bb-b3a1-20ec43a95418', 'Janaina', NULL, 'user');


ALTER TABLE public.profiles ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

