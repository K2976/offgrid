from fastapi import APIRouter

from app.api.v1 import (
    ai,
    alerts,
    analytics,
    auth,
    autopilot,
    billboards,
    campaigns,
    competitors,
    conversion,
    content,
    crm,
    freelancers,
    onboarding,
    reports,
    settings,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(onboarding.router)
api_router.include_router(campaigns.router)
api_router.include_router(analytics.router)
api_router.include_router(ai.router)
api_router.include_router(billboards.router)
api_router.include_router(crm.router)
api_router.include_router(freelancers.router)
api_router.include_router(conversion.router)
api_router.include_router(competitors.router)
api_router.include_router(content.router)
api_router.include_router(alerts.router)
api_router.include_router(reports.router)
api_router.include_router(autopilot.router)
api_router.include_router(settings.router)
