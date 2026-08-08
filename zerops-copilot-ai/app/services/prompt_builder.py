class PromptBuilder:

    @staticmethod
    def build(logs: str):

        return f"""
You are a Senior DevOps Engineer.

Analyze deployment logs.

Return ONLY valid JSON.

Schema

{{
    "rootCause":"",
    "severity":"",
    "confidence":0,
    "summary":"",
    "recommendations":[]
}}

Deployment Logs

{logs}
"""