import * as questionRepository from "@/repositories/question-repository";

export function getProductQuestions(productId: string) {
  return questionRepository.findQuestionsByProduct(productId);
}

export function askQuestion(productId: string, userId: string, question: string) {
  return questionRepository.createQuestion(productId, userId, question);
}

export function listAllQuestions(onlyUnanswered?: boolean) {
  return questionRepository.findAllQuestions(onlyUnanswered);
}

export function answerQuestion(id: string, answer: string) {
  return questionRepository.answerQuestion(id, answer);
}
