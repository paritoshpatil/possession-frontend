# Possession

**Tables**
1. **Items:**
    - **item_id (INT, Primary Key):** Unique identifier for each item.
    - **name (VARCHAR(255)):** Name of the item.
    - **description (TEXT):** Optional detailed description of the item.
    - **category_id (INT, Foreign Key):** References the "id" field in the "Categories" table (explained below).
    - **purchase_date (DATE):** Date the item was purchased.
    - **original_price (DECIMAL):** Original purchase price of the item.
    - **photo (BLOB):** Optional field to store an image of the item.
    - **location_id (INT, Foreign Key):** References the "location_id" field in the "Locations" table (explained below).
    - **container_id (INT, Foreign Key):** References the "container_id" field in the "Containers" table (explained below).
    - **warranty_info (TEXT):** Optional field to store warranty details (expiry date, company information).
2. **Categories:**
    - **category_id (INT, Primary Key):** Unique identifier for each category.
    - **name (VARCHAR(255)):** Name of the category (e.g., Electronics, Furniture, Jewelry).
3. **Locations (Rooms):**
    - **location_id (INT, Primary Key):** Unique identifier for each room.
    - **name (VARCHAR(255)):** Name of the room (e.g., Bedroom, Living Room, Garage).
4. **Containers:**
    - **container_id (INT, Primary Key):** Unique identifier for each container.
    - **name (VARCHAR(255)):** Name of the container (e.g., Drawer, Shelf, Toolbox).
    - **location_id (INT, Foreign Key):** References the "location_id" field in the "Locations" table, specifying the room the container is located in.

**Relationships:**

- One category can have many items (One-to-Many relationship between "Categories" and "Items" tables enforced by the foreign key).
- One location (room) can have many items and containers (One-to-Many relationship between "Locations" and both "Items" and "Containers" tables enforced by foreign keys).
- One container can hold many items (One-to-Many relationship between "Containers" and "Items" tables enforced by the foreign key).