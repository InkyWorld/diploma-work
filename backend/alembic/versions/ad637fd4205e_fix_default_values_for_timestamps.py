"""fix default values for timestamps

Revision ID: ad637fd4205e
Revises: 72629ae28d18
Create Date: 2025-04-24 14:05:06.797529

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ad637fd4205e'
down_revision: Union[str, None] = '72629ae28d18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'users', 'created_at',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.DateTime(timezone=True),
        server_default=sa.text('now()'),
        existing_nullable=False
    )
    op.alter_column(
        'users', 'updated_at',
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.DateTime(timezone=True),
        server_default=sa.text('now()'),
        existing_nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        'users', 'updated_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=None,
        existing_nullable=False
    )
    op.alter_column(
        'users', 'created_at',
        existing_type=sa.DateTime(timezone=True),
        server_default=None,
        existing_nullable=False
    )
