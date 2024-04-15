INSERT INTO categories (name) VALUES
('Electronics'),
('Furniture'),
('Clothing'),
('Books'),
('Sports Equipment');

INSERT INTO towns (name, population, area, is_deleted) VALUES
('New York', 8622698, 468.9, 0),
('Los Angeles', 3990456, 1214.9, 0),
('Chicago', 2705994, 227.3, 0),
('Houston', 2320268, 637.5, 0),
('Phoenix', 1680992, 517.6, 0);

INSERT INTO users (name, email, password, avatar_url) VALUES
('John Doe', 'john@example.com', '$2a$10$ObFu71jLLtxoj7ZBouusTO14oskJSSErrz6/fDa82CPRxyB21.bre', 'https://i.pravatar.cc/150?img=3'),
('Jane Smith', 'jane@example.com', '$2a$10$ObFu71jLLtxoj7ZBouusTO14oskJSSErrz6/fDa82CPRxyB21.bre', 'https://gravatar.com/avatar/59158f889f5eef8725098f3bdb6e2e99?s=200&d=robohash&r=x'),
('Mike Johnson', 'mike@example.com', '$2a$10$ObFu71jLLtxoj7ZBouusTO14oskJSSErrz6/fDa82CPRxyB21.bre', 'https://i.pravatar.cc/150?img=22'),
('Emily Davis', 'emily@example.com', '$2a$10$ObFu71jLLtxoj7ZBouusTO14oskJSSErrz6/fDa82CPRxyB21.bre', 'https://gravatar.com/avatar/59158f889f5eef8725098f3bdb6e2e99?s=200&d=retro&r=g'),
('Chris Wilson', 'chris@example.com', '$2a$10$ObFu71jLLtxoj7ZBouusTO14oskJSSErrz6/fDa82CPRxyB21.bre', 'https://gravatar.com/avatar/59158f889f5eef8725098f3bdb6e2e99?s=200&d=wavatar&r=r');

INSERT INTO ads (title, description, price, phone, town_id, user_id, is_published, image_main, category_id) VALUES
('Samsung 4K TV', 'Large Samsung 4K TV, excellent condition.', 599.99, '123-456-7890', 1, 1, 1, 'tv.jpg', 1),
('Oak Dining Table', 'Solid oak dining table with 6 chairs.', 799.99, '987-654-3210', 2, 2, 1, 'dining_table.jpg', 2),
('Leather Jacket', 'Stylish leather jacket, size medium.', 199.99, '555-555-5555', 3, 3, 1, 'leather_jacket.jpg', 3),
('Cookbook Collection', 'Collection of 20 best-selling cookbooks.', 99.99, '111-222-3333', 4, 4, 1, 'cookbooks.jpg', 4),
('Mountain Bike', 'Mountain bike with full suspension, like new.', 349.99, '999-888-7777', 5, 5, 1, 'bike.jpg', 5),
('Canon DSLR Camera', 'Canon DSLR camera with lenses and accessories.', 799.99, '123-456-7890', 1, 1, 1, 'camera.jpg', 1),
('Antique Coffee Table', 'Beautiful antique coffee table, one of a kind.', 599.99, '987-654-3210', 2, 2, 1, 'coffee_table.jpg', 2),
('Summer Dress', 'Light and airy summer dress, perfect for warm days.', 49.99, '555-555-5555', 3, 3, 1, 'summer_dress.jpg', 3),
('Guitar and Amp', 'Electric guitar with amplifier, great for beginners.', 249.99, '111-222-3333', 4, 4, 1, 'guitar.jpg', 4),
('Hiking Backpack', 'Spacious hiking backpack with hydration system.', 89.99, '999-888-7777', 5, 5, 1, 'backpack.jpg', 5),
('MacBook Pro', 'Apple MacBook Pro with Retina display, excellent condition.', 1099.99, '123-456-7890', 1, 1, 1, 'macbook.jpg', 1),
('L-shaped Desk', 'Large L-shaped desk with drawers, perfect for home office.', 449.99, '987-654-3210', 2, 2, 1, 'desk.jpg', 2),
('Vintage Vinyl Records', 'Collection of vintage vinyl records, assorted genres.', 99.99, '555-555-5555', 3, 3, 1, 'vinyl_records.jpg', 3),
('Running Shoes', 'Brand new running shoes, size 9.', 79.99, '111-222-3333', 4, 4, 1, 'running_shoes.jpg', 4),
('Dining Room Set', 'Complete dining room set with table and chairs.', 999.99, '999-888-7777', 5, 5, 1, 'dining_set.jpg', 5),
('Smartwatch', 'Fitness tracker smartwatch with heart rate monitor.', 149.99, '123-456-7890', 1, 1, 1, 'smartwatch.jpg', 1),
('Area Rug', 'Large area rug in modern design, good condition.', 299.99, '987-654-3210', 2, 2, 1, 'rug.jpg', 2),
('Digital Piano', '88-key digital piano with weighted keys, like new.', 699.99, '555-555-5555', 3, 3, 1, 'piano.jpg', 3),
('Camping Gear Bundle', 'Complete camping gear bundle for outdoor adventures.', 399.99, '111-222-3333', 4, 4, 1, 'camping_gear.jpg', 4),
('Home Theater System', 'Surround sound home theater system, great for movies.', 499.99, '999-888-7777', 5, 5, 1, 'home_theater.jpg', 5);