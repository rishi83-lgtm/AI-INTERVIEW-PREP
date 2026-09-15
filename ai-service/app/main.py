from collections import Counter
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="InterviewIQ AI Service", version="1.0.0")
SKILLS = ["python","java","javascript","typescript","react","node.js","express","mongodb","sql","mysql","postgresql","aws","docker","git","machine learning","data structures","algorithms","dsa","html","css","fastapi","django","flask","c++","c#","kubernetes","redis","graphql"]

class QuestionRequest(BaseModel):
    role: str
    skills: list[str] = []
    difficulty: str = "medium"
    type: str = "technical"
    count: int = Field(default=5, ge=1, le=15)
class AnswerRequest(BaseModel):
    question: str
    expectedAnswer: str
    candidateAnswer: str
    role: str = ""
class JobRequest(BaseModel):
    description: str = Field(min_length=30)
    resume_skills: list[str] = []

def extract_skills(text: str):
    lowered = text.lower()
    return [skill for skill in SKILLS if skill in lowered]

@app.get("/")
def health_check(): return {"status": "ok", "service": "interviewiq-ai"}

@app.post("/generate-questions")
def generate_questions(payload: QuestionRequest):
    skills = payload.skills or ["problem solving", "communication"]
    templates = {"hr":"Tell me about a time you handled a difficult situation involving {skill}.","behavioral":"Describe a project where you used {skill}. What was your contribution and outcome?","coding":"How would you approach a practical coding problem using {skill}? Discuss complexity and edge cases.","technical":"Explain {skill} in the context of a {role} role. Include trade-offs and a real example."}
    prompt = templates.get(payload.type, templates["technical"])
    questions=[]
    for index in range(payload.count):
        skill=skills[index % len(skills)]
        question=prompt.format(skill=skill,role=payload.role)
        expected=f"A strong answer defines {skill}, explains relevant trade-offs, and connects it to a concrete project or use case."
        questions.append({"question":question,"category":skill,"difficulty":payload.difficulty,"expectedAnswer":expected,"topic":skill})
    return {"questions":questions}

@app.post("/evaluate-answer")
def evaluate_answer(payload: AnswerRequest):
    candidate=payload.candidateAnswer.strip()
    if len(candidate.split()) < 8:
        return {"score":2,"correctness":2,"clarity":3,"technicalDepth":1,"feedback":"Expand your answer with a clear explanation and a concrete example.","strengths":[],"weakAreas":["Answer completeness"],"suggestedAnswer":payload.expectedAnswer}
    matrix=TfidfVectorizer(stop_words="english").fit_transform([payload.expectedAnswer,candidate])
    similarity=float(cosine_similarity(matrix[0],matrix[1])[0][0])
    expected_terms=set(extract_skills(payload.expectedAnswer)+extract_skills(payload.question))
    matched=[term for term in expected_terms if term in candidate.lower()]
    depth=min(10,round(3+len(matched)*2+min(len(candidate.split())/35,2)))
    correctness=max(1,min(10,round(3+similarity*7)))
    clarity=max(1,min(10,round(4+min(len(candidate.split())/30,4)+("example" in candidate.lower()))))
    score=round((correctness*0.5+clarity*0.25+depth*0.25),1)
    weak=[] if similarity>.45 else ["Key concepts and terminology"]
    return {"score":score,"correctness":correctness,"clarity":clarity,"technicalDepth":depth,"feedback":f"Your answer {'covers relevant concepts' if similarity>.45 else 'needs more direct coverage of the expected concepts'}. Add a concise example and explain trade-offs.","strengths":["Clear response structure"] if clarity>=7 else [],"weakAreas":weak,"suggestedAnswer":payload.expectedAnswer}

@app.post("/analyze-job")
def analyze_job(payload: JobRequest):
    required=extract_skills(payload.description)
    resume=[skill.lower() for skill in payload.resume_skills]
    matched=[skill for skill in required if skill in resume]
    missing=[skill for skill in required if skill not in resume]
    vector=TfidfVectorizer(stop_words="english").fit_transform([payload.description," ".join(payload.resume_skills)])
    similarity=round(float(cosine_similarity(vector[0],vector[1])[0][0])*100)
    return {"requiredSkills":required,"preferredSkills":[],"matchedSkills":matched,"missingSkills":missing,"matchPercentage":similarity,"keywords":[word for word,_ in Counter(payload.description.lower().split()).most_common(12)]}
