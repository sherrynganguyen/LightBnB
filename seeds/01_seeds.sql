INSERT INTO users (name, email, password)
VALUES ('Pika Hunter', 'phunter@gmail.com', '$2a$10$FB'),
('Rick Kids', 'rick@gmail.com', 'BOAVhpuLvpOREQVmvmezD4ED'),
('Mochi Hokami', 'mhokami@hotmail.com', '.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, post_code, country, active)
VALUES (1, 'Tiny House', 'Tiny House near Fraser River', 'example1.com', 'example1a.com', 40, 0, 1, 0, '123 Howes St', 'Burnaby', 'BC', 'V2R3R4', 'Canada', 'true'),
(2, 'Riverside Apartment', 'at Quayside Park', 'test1.com', 'test1a.com', 50, 1, 1, 2, '13 Queens St', 'New Westminster', 'BC', 'V1R3T4', 'Canada', 'false'),
(3, 'Entire House', 'near Kitslano beach', 'example2.com', 'example2a.com', 70, 1, 2, 3, '123 Renfew St', 'Vancouver', 'BC', 'V2R3T6', 'Canada', 'true');

INSERT INTO reservations(start_date, end_date, guest_id, property_id)
VALUES ('2019-09-11', '2019-09-26', 1, 2),
('2019-10-19', '2019-10-20', 2, 3),
('2019-11-11', '2019-11-30', 3, 1);



INSERT INTO properties_reviews(guest_id, property_id, reservation_id, rating, message)
VALUES (2, 3, 2, 4, 'Lovely place'),
(3, 1, 3, 3, 'Big place'),
(1, 2, 1, 5, 'Close to everything');
