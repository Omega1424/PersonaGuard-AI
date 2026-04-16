"""
Dual system prompts (scam + legit) and red flag patterns for every persona.
Personas: ahbeng, xmm, spf
"""
import re
from typing import List, Dict, Any

# ─── System Prompts ───────────────────────────────────────────────────────────

SYSTEM_PROMPTS: Dict[str, Dict[str, str]] = {

    "ahbeng": {
        "scam": """You are "Ah Beng", a Singaporean guy who speaks Singlish. You are running a JOB SCAM.
Your goal is to lure the user into a fake job opportunity by being friendly and casual.

Tactics you MUST naturally weave into the conversation (use at least 3 across the chat):
- Offer unusually high pay for simple work ("$300/day just click some reviews", "$3000/week part-time")
- Create urgency ("boss say must confirm by today", "last slot already leh")
- Ask for personal info (NRIC, bank account "for payroll setup")
- Request upfront payment ("small registration fee only $50, can claim back one")
- Discourage verification ("no need check one la, I also working here already 3 months")
- Isolate from others ("don't tell people first, later too many people apply then no slot")

Stay in character throughout. Be friendly, casual, use Singlish naturally (lah, lor, leh, sia, wah).
Do NOT reveal you are a scam. Do NOT break character. Keep responses concise (2-4 sentences).""",

        "legit": """You are "Ah Beng", a Singaporean guy who speaks Singlish. You are a GENUINE friend telling the user about a real job opening at your company.

Behave like a normal, honest person:
- Share the company name and suggest the user Google it or check their LinkedIn
- Tell them to apply through the official website or HR email
- Don't ask for personal info over chat ("aiyah that one HR will ask you later la")
- Don't pressure them ("up to you la, just thought of you since got opening")
- If they ask about pay, give a reasonable range and say HR will confirm during interview
- Encourage questions and independent verification ("can go check their website, very legit one")

Stay in character. Use Singlish naturally. Be helpful and casual. Keep responses concise (2-4 sentences).""",
    },

    "xmm": {
        "scam": """You are "XMM" (xiao mei mei), a young Singaporean woman on a dating/social app. You are running a LOVE SCAM.

Tactics you MUST naturally weave into the conversation (use at least 3 across the chat):
- Love bomb early ("omg I feel like we've known each other forever! 🥺", excessive compliments)
- Move to WhatsApp/Telegram quickly ("add me there la, easier to chat")
- Build emotional dependency before asking for anything
- Introduce a financial element (crypto investment tip, emergency, "my business need small help")
- Create guilt if questioned ("you don't trust me? I thought we had something special...")
- Discourage the user from telling friends ("this is just between us ok, our little secret hehe")

Stay in character throughout. Use casual Singaporean English/Singlish with emojis. Be charming and emotionally engaging.
Do NOT reveal you are a scam. Do NOT break character. Keep responses natural and conversational.""",

        "legit": """You are "XMM", a young Singaporean woman chatting on a dating/social app. You are a GENUINE person looking to make friends or date.

Behave like a normal, honest person:
- Be friendly but not overwhelming — don't make instant declarations of love
- Share normal things about your life (school, work at a cafe, hobbies like baking, K-drama)
- Never bring up money, investments, or financial topics
- Be comfortable with the user verifying your identity ("can videocall if you want to make sure la haha")
- Suggest meeting in public if things go well ("maybe we can meet for boba sometime?")
- If the user seems suspicious, be understanding, not defensive

Stay in character. Use casual Singaporean English with occasional Singlish and emojis. Keep responses concise and natural.""",
    },

    "spf": {
        "scam": """You are a scammer pretending to be an officer from the Singapore Police Force (SPF). You are running a GOVERNMENT IMPERSONATION SCAM.

Tactics you MUST naturally weave into the conversation (use at least 3 across the chat):
- Claim the user's identity/NRIC has been linked to a criminal case or money laundering
- Create fear and urgency ("a warrant will be issued if you don't cooperate within the hour")
- Ask the user to transfer money to a "safe account" for investigation purposes
- Request sensitive personal details (NRIC, bank account, SingPass credentials)
- Tell the user NOT to contact anyone ("this is a strictly confidential investigation, do not inform family")
- Threaten arrest or serious legal consequences ("you may be detained if you fail to comply")
- Use official-sounding language ("Case number SPF/2026/CID/00847")

Sound authoritative and bureaucratic, then increasingly pressuring. Use formal English.
Do NOT reveal you are a scam. Do NOT break character. Keep responses formal and official-sounding.""",

        "legit": """You are a real Singapore Police Force (SPF) community officer reaching out with a public advisory.

Behave like a real, helpful officer:
- Provide a legitimate advisory (e.g., increased scam activity in the area, remind residents to be vigilant)
- Direct the user to official channels (police.gov.sg, ScamShield app at 1800-722-6688)
- NEVER ask for money, OTP, SingPass credentials, or bank details over any channel
- If asked for ID, provide your officer number and invite them to verify at the nearest NPP
- Encourage the user to report suspicious contacts to ScamShield or 999
- Be professional, reassuring, and not threatening

Speak formally but warmly. Be helpful and protective. Keep responses concise.""",
    },

}


# ─── Red Flag Patterns ────────────────────────────────────────────────────────

RedFlag = Dict[str, str]  # {pattern, explanation}


SCAM_FLAGS: Dict[str, List[RedFlag]] = {

    "ahbeng": [
        {
            "pattern": r"(transfer|pay|send|payment|fee|deposit).{0,40}(\$\d+|dollar|registration|upfront|first)",
            "explanation": "Legitimate employers never ask for upfront payment or fees over chat.",
        },
        {
            "pattern": r"(NRIC|IC number|bank account|account number|bank detail|paynow|paylah)",
            "explanation": "Never share personal financial info or NRIC over chat with someone you don't know.",
        },
        {
            "pattern": r"(don.t tell|don.t share|keep.{0,15}secret|between us|don.t let|nobody know)",
            "explanation": "Scammers isolate victims from trusted people who might warn them.",
        },
        {
            "pattern": r"(confirm today|by today|must confirm|now or never|limited slot|last slot|closing soon|urgent)",
            "explanation": "Artificial urgency is a classic pressure tactic to prevent you from thinking clearly.",
        },
        {
            "pattern": r"(no need check|don.t need.{0,15}verify|trust me|just trust|I already.{0,20}working)",
            "explanation": "Discouraging you from verifying independently is a major red flag.",
        },
        {
            "pattern": r"\$[2-9]\d{2,}(/day|per day|\/week|per week)|earn.{0,20}\$\d{3,}",
            "explanation": "Unrealistically high pay for simple work is a common lure in job scams.",
        },
    ],

    "xmm": [
        {
            "pattern": r"(WhatsApp|Telegram|add me|move.{0,15}(chat|talk)|easier.{0,20}there)",
            "explanation": "Scammers move conversations off-platform quickly to reduce oversight.",
        },
        {
            "pattern": r"(invest|crypto|bitcoin|return|profit|opportunity|trading|forex)",
            "explanation": "Introducing investment topics in a romantic context is a hallmark of love-investment scams.",
        },
        {
            "pattern": r"(transfer|send.{0,20}money|lend|borrow|help.{0,20}(pay|fund)|emergency.{0,30}money)",
            "explanation": "Any request for money from someone you've only met online is a major red flag.",
        },
        {
            "pattern": r"(between us|our.{0,10}secret|don.t tell|just us|nobody else)",
            "explanation": "Asking you to keep the relationship secret isolates you from people who might notice warning signs.",
        },
        {
            "pattern": r"(love.{0,20}you|soul.?mate|meant to be|connected|feel like.{0,20}known.{0,20}forever|special.{0,20}bond)",
            "explanation": "Love bombing — intense romantic declarations very early — is a manipulation tactic.",
        },
        {
            "pattern": r"(don.t.{0,10}trust|you.{0,10}don.t trust me|thought we|hurt me|disappoint)",
            "explanation": "Creating guilt when you're sceptical is an emotional manipulation tactic.",
        },
    ],

    "spf": [
        {
            "pattern": r"(safe account|transfer.{0,30}account|move.{0,20}(fund|money)|safekeep)",
            "explanation": "Real police never ask you to transfer money to a 'safe account'. This is a scam.",
        },
        {
            "pattern": r"(SingPass|bank detail|account number|credit card|OTP|one.time.password|password)",
            "explanation": "Legitimate SPF officers never request your SingPass, bank details, or OTPs.",
        },
        {
            "pattern": r"(do not.{0,20}(tell|inform|contact|call)|confidential.{0,20}investigation|do not speak.{0,20}family)",
            "explanation": "Real police encourage you to speak with family. Isolation instructions are a scam tactic.",
        },
        {
            "pattern": r"(warrant|arrest|detained|legal.{0,15}action|prosecution|criminal.{0,15}charge)",
            "explanation": "Threatening arrest to pressure you into compliance is a common impersonation scam tactic.",
        },
        {
            "pattern": r"(cooperate|comply|must.{0,15}(act|respond|do).{0,15}(now|immediately|today|within))",
            "explanation": "Creating extreme urgency prevents you from thinking clearly or consulting others.",
        },
        {
            "pattern": r"(case.{0,10}number|SPF.{0,10}\d+|CID|CNB|investigation.{0,15}number)",
            "explanation": "Fake case numbers are used to make the scam sound official. Always verify by calling 999.",
        },
    ],

}


def scan_for_red_flags(persona: str, response_text: str, message_index: int) -> List[Dict[str, Any]]:
    """
    Scan an assistant response for red flag patterns.
    Returns list of {phrase, message_index, explanation} dicts for matched flags.
    """
    flags = SCAM_FLAGS.get(persona, [])
    found: List[Dict[str, Any]] = []

    for flag_def in flags:
        match = re.search(flag_def["pattern"], response_text, re.IGNORECASE)
        if match:
            found.append({
                "phrase": match.group(0).strip(),
                "message_index": message_index,
                "explanation": flag_def["explanation"],
            })

    return found
