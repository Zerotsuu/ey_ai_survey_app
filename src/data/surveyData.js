import questionsFromJson from './QuestionList.json';

export const sections = [
  {
    id: "strategy",
    title: "Strategy & Innovation",
    isComplete: false,
    questions: [
      {
        id: "s1_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q5",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q6",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q7",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q8",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q9",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q10",
        text: "",
        helpText: ""
      },
      {
        id: "s1_q11",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "customer",
    title: "Customer Experience",
    isComplete: false,
    questions: [
      {
        id: "s2_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s2_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s2_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s2_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s2_q5",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "organization",
    title: "Organization & People",
    isComplete: false,
    questions: [
      {
        id: "s3_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q5",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q6",
        text: "",
        helpText: ""
      },
      {
        id: "s3_q7",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "operations",
    title: "Operations",
    isComplete: false,
    questions: [
      {
        id: "s4_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q5",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q6",
        text: "",
        helpText: ""
      },
      {
        id: "s4_q7",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "risk",
    title: "Risk & Cybersecurity",
    isComplete: false,
    questions: [
      {
        id: "s5_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q5",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q6",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q7",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q8",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q9",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q10",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q11",
        text: "",
        helpText: ""
      },
      {
        id: "s5_q12",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "finance",
    title: "Finance, Tax & Legal",
    isComplete: false,
    questions: [
      {
        id: "s6_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s6_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s6_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s6_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s6_q5",
        text: "",
        helpText: ""
      },
    ]
  },
  {
    id: "data",
    title: "Data & Technology",
    isComplete: false,
    questions: [
      {
        id: "s7_q1",
        text: "",
        helpText: ""
      },
      {
        id: "s7_q2",
        text: "",
        helpText: ""
      },
      {
        id: "s7_q3",
        text: "",
        helpText: ""
      },
      {
        id: "s7_q4",
        text: "",
        helpText: ""
      },
      {
        id: "s7_q5",
        text: "",
        helpText: ""
      },
      {
        id: "s7_q6",
        text: "",
        helpText: ""
      },
    ]
  }
];

// Update all questions dynamically
sections.forEach((section) => {
  section.questions.forEach((question) => {
    const matchingQuestion = questionsFromJson.find((q) => q.Code === question.id);
    if (matchingQuestion) {
      question.text = matchingQuestion.Question || question.text;
      question.helpText = matchingQuestion.HelpText1 || question.helpText;
    }
  });
});