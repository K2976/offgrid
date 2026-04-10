import asyncio
import logging

from app.db import SessionLocal
from app.services import (
    run_campaign_performance_updates,
    run_daily_ai_insight_generation,
    run_periodic_analytics_aggregation,
)

logger = logging.getLogger("offgrid-background")


async def analytics_aggregation_loop() -> None:
    while True:
        db = SessionLocal()
        try:
            run_periodic_analytics_aggregation(db)
            logger.info("analytics_aggregation_completed")
        except Exception:
            logger.exception("analytics_aggregation_failed")
        finally:
            db.close()
        await asyncio.sleep(60 * 60 * 3)


async def daily_ai_insights_loop() -> None:
    while True:
        db = SessionLocal()
        try:
            run_daily_ai_insight_generation(db)
            logger.info("daily_ai_insights_completed")
        except Exception:
            logger.exception("daily_ai_insights_failed")
        finally:
            db.close()
        await asyncio.sleep(60 * 60 * 24)


async def campaign_updates_loop() -> None:
    while True:
        db = SessionLocal()
        try:
            run_campaign_performance_updates(db)
            logger.info("campaign_performance_updates_completed")
        except Exception:
            logger.exception("campaign_performance_updates_failed")
        finally:
            db.close()
        await asyncio.sleep(60 * 60 * 6)
