exports.up = async (knex) => {

  // ══════════════════════════════════════════════════════════════════════════
  // 1. USERS & AUTH
  // ══════════════════════════════════════════════════════════════════════════

  // Admin users with roles
  await knex.schema.createTable('users', (t) => {
    t.string('id').primary(); // USR-timestamp
    t.string('username', 50).notNullable().unique();
    t.string('email', 254).notNullable().unique();
    t.string('password_hash').notNullable();
    t.string('full_name', 100);
    t.string('phone', 30);
    t.string('avatar');
    t.enum('role', ['superadmin', 'admin', 'editor', 'viewer']).defaultTo('viewer');
    t.boolean('is_active').defaultTo(true);
    t.timestamp('last_login');
    t.string('last_ip', 45);
    t.timestamps(true, true);
    t.index('role');
  });

  // Login sessions
  await knex.schema.createTable('sessions', (t) => {
    t.string('id').primary(); // session token
    t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('ip', 45);
    t.string('user_agent');
    t.timestamp('expires_at').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('user_id');
    t.index('expires_at');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 2. CRM & CUSTOMERS
  // ══════════════════════════════════════════════════════════════════════════

  // Customers (hotels, companies)
  await knex.schema.createTable('customers', (t) => {
    t.string('id').primary(); // CUST-timestamp
    t.string('company_name', 200).notNullable();
    t.string('contact_person', 100);
    t.string('email', 254);
    t.string('phone', 30);
    t.string('phone2', 30);
    t.string('address');
    t.string('city', 50);
    t.string('country', 50).defaultTo('Azərbaycan');
    t.enum('hotel_stars', ['3', '4', '5', 'other']);
    t.integer('room_count');
    t.enum('type', ['hotel', 'resort', 'restaurant', 'hospital', 'office', 'other']).defaultTo('hotel');
    t.enum('status', ['lead', 'prospect', 'active', 'inactive', 'churned']).defaultTo('lead');
    t.string('source', 50); // website, referral, cold_call, etc.
    t.text('notes');
    t.decimal('lifetime_value', 12, 2).defaultTo(0);
    t.string('assigned_to').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('status');
    t.index('type');
    t.index('assigned_to');
  });

  // Customer interactions/activities
  await knex.schema.createTable('customer_activities', (t) => {
    t.string('id').primary();
    t.string('customer_id').notNullable().references('id').inTable('customers').onDelete('CASCADE');
    t.string('user_id').references('id').inTable('users');
    t.enum('type', ['call', 'email', 'meeting', 'note', 'quote_sent', 'order', 'complaint', 'follow_up']).notNullable();
    t.string('subject', 200);
    t.text('description');
    t.timestamp('scheduled_at');
    t.boolean('completed').defaultTo(false);
    t.timestamps(true, true);
    t.index('customer_id');
    t.index('type');
    t.index('scheduled_at');
  });

  // Customer documents
  await knex.schema.createTable('customer_documents', (t) => {
    t.string('id').primary();
    t.string('customer_id').notNullable().references('id').inTable('customers').onDelete('CASCADE');
    t.string('name', 200).notNullable();
    t.enum('type', ['contract', 'invoice', 'quote', 'sds', 'certificate', 'other']).notNullable();
    t.string('file_url');
    t.integer('file_size');
    t.string('mime_type', 50);
    t.string('uploaded_by').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('customer_id');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 3. ORDERS & INVOICES
  // ══════════════════════════════════════════════════════════════════════════

  // Orders
  await knex.schema.createTable('orders', (t) => {
    t.string('id').primary(); // ORD-timestamp
    t.string('customer_id').notNullable().references('id').inTable('customers');
    t.string('quote_id').references('id').inTable('quote_requests');
    t.enum('status', ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).defaultTo('draft');
    t.decimal('subtotal', 12, 2).defaultTo(0);
    t.decimal('tax_amount', 12, 2).defaultTo(0);
    t.decimal('discount_amount', 12, 2).defaultTo(0);
    t.decimal('total', 12, 2).defaultTo(0);
    t.string('currency', 3).defaultTo('AZN');
    t.text('notes');
    t.text('delivery_address');
    t.timestamp('estimated_delivery');
    t.timestamp('actual_delivery');
    t.string('created_by').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('customer_id');
    t.index('status');
    t.index('created_at');
  });

  // Order items
  await knex.schema.createTable('order_items', (t) => {
    t.increments('id');
    t.string('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE');
    t.string('product_id').references('id').inTable('products');
    t.string('product_name', 200).notNullable();
    t.string('product_code', 50);
    t.string('variant', 60);
    t.string('size', 30);
    t.integer('quantity').notNullable().defaultTo(1);
    t.decimal('unit_price', 10, 2);
    t.decimal('total_price', 10, 2);
    t.text('notes');
    t.index('order_id');
  });

  // Invoices
  await knex.schema.createTable('invoices', (t) => {
    t.string('id').primary(); // INV-timestamp
    t.string('order_id').references('id').inTable('orders');
    t.string('customer_id').notNullable().references('id').inTable('customers');
    t.enum('status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']).defaultTo('draft');
    t.decimal('amount', 12, 2).notNullable();
    t.decimal('paid_amount', 12, 2).defaultTo(0);
    t.string('currency', 3).defaultTo('AZN');
    t.timestamp('due_date');
    t.timestamp('paid_at');
    t.string('payment_method', 50);
    t.text('notes');
    t.string('pdf_url');
    t.timestamps(true, true);
    t.index('customer_id');
    t.index('status');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 4. INVENTORY & PRICING
  // ══════════════════════════════════════════════════════════════════════════

  // Product pricing (tiered)
  await knex.schema.createTable('product_prices', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    t.string('size', 30);
    t.decimal('price', 10, 2).notNullable();
    t.decimal('cost', 10, 2); // cost price
    t.integer('min_quantity').defaultTo(1);
    t.string('currency', 3).defaultTo('AZN');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
    t.index('product_id');
  });

  // Inventory tracking
  await knex.schema.createTable('inventory', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    t.string('size', 30);
    t.integer('stock_quantity').defaultTo(0);
    t.integer('min_stock').defaultTo(5); // reorder point
    t.integer('max_stock').defaultTo(100);
    t.string('warehouse', 50).defaultTo('Bakı');
    t.timestamp('last_restocked');
    t.timestamps(true, true);
    t.unique(['product_id', 'size', 'warehouse']);
  });

  // Inventory movements
  await knex.schema.createTable('inventory_movements', (t) => {
    t.increments('id');
    t.string('product_id').notNullable().references('id').inTable('products');
    t.string('size', 30);
    t.enum('type', ['in', 'out', 'adjustment', 'return']).notNullable();
    t.integer('quantity').notNullable();
    t.string('reference_type', 20); // order, return, manual
    t.string('reference_id');
    t.text('notes');
    t.string('created_by').references('id').inTable('users');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('product_id');
    t.index('created_at');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 5. SITE CONTENT (CMS)
  // ══════════════════════════════════════════════════════════════════════════

  // Site pages and content blocks
  await knex.schema.createTable('site_pages', (t) => {
    t.string('id').primary();
    t.string('slug', 100).notNullable().unique();
    t.string('title', 200).notNullable();
    t.string('meta_description');
    t.string('meta_keywords');
    t.string('og_image');
    t.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
    t.string('lang', 5).defaultTo('az');
    t.timestamps(true, true);
  });

  // Content blocks (hero, sections, etc.)
  await knex.schema.createTable('content_blocks', (t) => {
    t.string('id').primary();
    t.string('page_id').references('id').inTable('site_pages').onDelete('CASCADE');
    t.string('section', 50).notNullable(); // hero, overview, trust, faq, etc.
    t.string('key', 100).notNullable(); // field name
    t.text('value_az');
    t.text('value_en');
    t.text('value_ru');
    t.string('type', 20).defaultTo('text'); // text, html, image, number
    t.integer('sort_order').defaultTo(0);
    t.timestamps(true, true);
    t.index(['page_id', 'section']);
    t.unique(['page_id', 'section', 'key']);
  });

  // Site edits history
  await knex.schema.createTable('site_edits', (t) => {
    t.increments('id');
    t.string('user_id').references('id').inTable('users');
    t.string('section', 50).notNullable();
    t.string('field', 100);
    t.text('old_value');
    t.text('new_value');
    t.string('lang', 5).defaultTo('az');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('section');
    t.index('created_at');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 6. MEDIA LIBRARY
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('media', (t) => {
    t.string('id').primary();
    t.string('filename', 200).notNullable();
    t.string('original_name', 200);
    t.string('mime_type', 50);
    t.integer('file_size');
    t.integer('width');
    t.integer('height');
    t.string('url').notNullable();
    t.string('thumbnail_url');
    t.string('alt_text');
    t.string('folder', 100).defaultTo('general');
    t.json('tags');
    t.string('uploaded_by').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('folder');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 7. ANALYTICS & TRACKING
  // ══════════════════════════════════════════════════════════════════════════

  // Page views
  await knex.schema.createTable('page_views', (t) => {
    t.increments('id');
    t.string('page', 200);
    t.string('referrer');
    t.string('ip', 45);
    t.string('user_agent');
    t.string('country', 2);
    t.string('city', 50);
    t.string('device', 20); // desktop, mobile, tablet
    t.string('browser', 30);
    t.integer('duration_seconds');
    t.string('session_id', 64);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('page');
    t.index('created_at');
    t.index('session_id');
  });

  // Events (clicks, form submissions, etc.)
  await knex.schema.createTable('analytics_events', (t) => {
    t.increments('id');
    t.string('event_name', 100).notNullable(); // page_view, cta_click, form_submit, product_view, quote_request
    t.string('event_category', 50); // engagement, conversion, navigation
    t.string('event_label');
    t.json('event_data');
    t.string('page', 200);
    t.string('session_id', 64);
    t.string('ip', 45);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('event_name');
    t.index('event_category');
    t.index('created_at');
  });

  // Daily aggregated stats
  await knex.schema.createTable('daily_stats', (t) => {
    t.increments('id');
    t.date('date').notNullable();
    t.integer('page_views').defaultTo(0);
    t.integer('unique_visitors').defaultTo(0);
    t.integer('form_submissions').defaultTo(0);
    t.integer('quote_requests').defaultTo(0);
    t.integer('whatsapp_clicks').defaultTo(0);
    t.integer('product_views').defaultTo(0);
    t.decimal('avg_session_duration', 6, 1).defaultTo(0);
    t.decimal('bounce_rate', 5, 2).defaultTo(0);
    t.timestamps(true, true);
    t.unique('date');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 8. AUDIT LOG
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('audit_log', (t) => {
    t.increments('id');
    t.string('user_id').references('id').inTable('users');
    t.string('action', 50).notNullable(); // create, update, delete, login, logout, deploy, etc.
    t.string('entity_type', 50); // product, customer, order, quote, content, etc.
    t.string('entity_id');
    t.text('old_data');
    t.text('new_data');
    t.string('ip', 45);
    t.string('user_agent');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('user_id');
    t.index('action');
    t.index('entity_type');
    t.index('created_at');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 9. NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('notifications', (t) => {
    t.increments('id');
    t.string('user_id').references('id').inTable('users').onDelete('CASCADE');
    t.string('title', 200).notNullable();
    t.text('message');
    t.enum('type', ['info', 'success', 'warning', 'error', 'order', 'quote', 'message']).defaultTo('info');
    t.string('link');
    t.boolean('is_read').defaultTo(false);
    t.timestamp('read_at');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('user_id');
    t.index('is_read');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 10. SETTINGS & CONFIG
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('settings', (t) => {
    t.string('key', 100).primary();
    t.text('value');
    t.string('type', 20).defaultTo('string'); // string, number, boolean, json
    t.string('group', 50).defaultTo('general');
    t.string('description');
    t.timestamps(true, true);
  });

  // Email templates
  await knex.schema.createTable('email_templates', (t) => {
    t.string('id').primary();
    t.string('name', 100).notNullable();
    t.string('subject', 200).notNullable();
    t.text('body_html').notNullable();
    t.text('body_text');
    t.string('lang', 5).defaultTo('az');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 11. PILOT PROGRAMS & CONTRACTS
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('pilot_programs', (t) => {
    t.string('id').primary();
    t.string('customer_id').notNullable().references('id').inTable('customers');
    t.enum('status', ['requested', 'approved', 'active', 'completed', 'cancelled']).defaultTo('requested');
    t.timestamp('start_date');
    t.timestamp('end_date');
    t.text('products_tested'); // JSON array of product IDs
    t.text('feedback');
    t.integer('satisfaction_score'); // 1-10
    t.boolean('converted_to_order').defaultTo(false);
    t.string('assigned_to').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('customer_id');
    t.index('status');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 12. FAQ & BLOG
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('faq_items', (t) => {
    t.increments('id');
    t.string('question_az').notNullable();
    t.text('answer_az').notNullable();
    t.string('question_en');
    t.text('answer_en');
    t.string('question_ru');
    t.text('answer_ru');
    t.string('category', 50);
    t.integer('sort_order').defaultTo(0);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('blog_posts', (t) => {
    t.string('id').primary();
    t.string('slug', 200).notNullable().unique();
    t.string('title_az', 200).notNullable();
    t.text('content_az');
    t.string('title_en', 200);
    t.text('content_en');
    t.string('title_ru', 200);
    t.text('content_ru');
    t.string('featured_image');
    t.string('author_id').references('id').inTable('users');
    t.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
    t.json('tags');
    t.string('meta_description');
    t.integer('view_count').defaultTo(0);
    t.timestamp('published_at');
    t.timestamps(true, true);
    t.index('status');
    t.index('slug');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 13. DELIVERY & LOGISTICS
  // ══════════════════════════════════════════════════════════════════════════

  await knex.schema.createTable('deliveries', (t) => {
    t.string('id').primary();
    t.string('order_id').notNullable().references('id').inTable('orders');
    t.enum('status', ['pending', 'picked_up', 'in_transit', 'delivered', 'failed']).defaultTo('pending');
    t.string('tracking_number', 50);
    t.string('carrier', 50);
    t.text('delivery_address');
    t.string('recipient_name', 100);
    t.string('recipient_phone', 30);
    t.text('delivery_notes');
    t.timestamp('estimated_delivery');
    t.timestamp('actual_delivery');
    t.string('proof_of_delivery'); // photo URL
    t.string('created_by').references('id').inTable('users');
    t.timestamps(true, true);
    t.index('order_id');
    t.index('status');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // DEFAULT SETTINGS
  // ══════════════════════════════════════════════════════════════════════════

  await knex('settings').insert([
    { key: 'site_name', value: 'MI CLEAN GROUP MMC', type: 'string', group: 'general', description: 'Sayt adı' },
    { key: 'site_phone', value: '+994 55 488 22 22', type: 'string', group: 'contact', description: 'Əsas telefon' },
    { key: 'site_email', value: 'micleangroupmmc@gmail.com', type: 'string', group: 'contact', description: 'Əsas email' },
    { key: 'site_address', value: 'Bakı, Azərbaycan', type: 'string', group: 'contact', description: 'Ünvan' },
    { key: 'voen', value: '1234567891', type: 'string', group: 'legal', description: 'VOEN' },
    { key: 'delivery_days', value: '5-7', type: 'string', group: 'logistics', description: 'Standart çatdırılma müddəti' },
    { key: 'currency', value: 'AZN', type: 'string', group: 'pricing', description: 'Əsas valyuta' },
    { key: 'tax_rate', value: '18', type: 'number', group: 'pricing', description: 'ƏDV faizi' },
    { key: 'whatsapp_number', value: '994554882222', type: 'string', group: 'contact', description: 'WhatsApp nömrəsi' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean', group: 'general', description: 'Texniki xidmət rejimi' },
  ]);

  // Default email templates
  await knex('email_templates').insert([
    { id: 'contact_admin', name: 'Yeni mesaj bildirişi', subject: 'Yeni əlaqə mesajı: {{name}}', body_html: '<h2>Yeni mesaj</h2><p>Ad: {{name}}</p><p>Email: {{email}}</p><p>Otel: {{hotel}}</p><p>Mesaj: {{message}}</p>', lang: 'az' },
    { id: 'contact_user', name: 'Mesaj təsdiqi', subject: 'MI CLEAN GROUP — mesajınız alındı', body_html: '<h2>Hörmətli {{name}},</h2><p>Mesajınız uğurla alındı. 24 saat ərzində sizinlə əlaqə saxlayacağıq.</p>', lang: 'az' },
    { id: 'quote_admin', name: 'Yeni sorğu bildirişi', subject: 'Yeni qiymət sorğusu: {{hotel}}', body_html: '<h2>Yeni sorğu</h2><p>Ad: {{name}}</p><p>Otel: {{hotel}}</p><p>Kateqoriyalar: {{categories}}</p>', lang: 'az' },
    { id: 'quote_user', name: 'Sorğu təsdiqi', subject: 'MI CLEAN GROUP — sorğunuz alındı', body_html: '<h2>Hörmətli {{name}},</h2><p>Qiymət sorğunuz alındı. 24 saat ərzində təklif göndərəcəyik.</p>', lang: 'az' },
  ]);
};

exports.down = async (knex) => {
  const tables = [
    'deliveries', 'blog_posts', 'faq_items', 'pilot_programs',
    'email_templates', 'settings', 'notifications', 'audit_log',
    'daily_stats', 'analytics_events', 'page_views',
    'media', 'site_edits', 'content_blocks', 'site_pages',
    'inventory_movements', 'inventory', 'product_prices',
    'order_items', 'invoices', 'orders',
    'customer_documents', 'customer_activities', 'customers',
    'sessions', 'users'
  ];
  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }
};
