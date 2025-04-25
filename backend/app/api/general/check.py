from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.core import log

general_check_router = APIRouter(prefix='/general', tags=['general'])

@general_check_router.get("/health_checker")
async def health_checker(db: AsyncSession = Depends(get_db)):
    """
    Endpoint to check the health of the database connection.

    This endpoint performs a simple database query (`SELECT 1`) to verify if the database
    is connected and configured correctly. If the query succeeds, a success message with
    the result is returned. If the query fails or any other error occurs during the connection,
    an HTTP 500 error is raised with a message indicating the failure.

    Args:
        db (AsyncSession): The database session, injected by FastAPI's dependency system.

    Raises:
        HTTPException: If the database query fails or the database connection is not properly
        configured, an HTTP 500 error is raised with an appropriate message.

    Returns:
        dict: A dictionary containing a health check message and the result of the query.

    Example:
        ```python
        response = await client.get("/api/health_checker")
        assert response.status_code == 200
        assert response.json() == {"message": "Database is connected and healthy", "result": 1}
        ```
    """
    try:
        # Make request
        result = await db.execute(text("SELECT 1"))
        result = result.fetchone()
        log.debug(result)
        if result is None:
            raise HTTPException(
                status_code=500, detail="Database is not configured correctly"
            )

        return {"message": "Database is connected and healthy", "result": result[0]}

    except Exception as e:
        log.error(e)
        raise HTTPException(status_code=500, detail="Error connecting to the database")