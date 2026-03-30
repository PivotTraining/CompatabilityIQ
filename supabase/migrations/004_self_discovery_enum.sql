-- CompatibleIQ -- Self-Discovery Payment Enum Migration
-- Adds self_discovery_report to payment_product_type enum

ALTER TYPE payment_product_type ADD VALUE IF NOT EXISTS 'self_discovery_report';
