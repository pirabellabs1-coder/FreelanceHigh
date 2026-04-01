## ADDED Requirements

### Requirement: Product description supports rich content with images
The product creation/editing form SHALL use a Tiptap rich text editor that supports inline images, headings, bold, italic, lists, and links.

#### Scenario: Instructor adds image to product description
- **WHEN** the instructor clicks the image button in the Tiptap editor toolbar
- **THEN** they can upload an image or paste a URL, and the image renders inline in the description

#### Scenario: Product detail page renders rich description
- **WHEN** a user views a product detail page
- **THEN** the description renders with all rich formatting including inline images via TiptapRenderer

### Requirement: Product description image upload
The system SHALL provide an image upload endpoint that accepts images for product descriptions and returns a Cloudinary URL.

#### Scenario: Image upload for product description
- **WHEN** an instructor uploads an image via the Tiptap editor
- **THEN** the image is uploaded to Cloudinary and the editor inserts the returned URL

### Requirement: Product banner and gallery
The product creation form SHALL allow uploading a banner image and optionally multiple gallery images.

#### Scenario: Instructor uploads product banner
- **WHEN** the instructor uploads a banner image on the product creation form
- **THEN** the banner is displayed on the product detail page as the main hero image
