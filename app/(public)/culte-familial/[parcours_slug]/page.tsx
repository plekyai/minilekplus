export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getParcoursWithQuestions } from '@/lib/supabase/queries/parcours'
import { QuizShell } from '@/components/quiz/QuizShell'

interface Props {
  params: { parcours_slug: string }
}

export default async function QuizPage({ params }: Props) {
  const data = await getParcoursWithQuestions(params.parcours_slug).catch(() => null)
  if (!data) notFound()
  return <QuizShell parcours={data.parcours} questions={data.questions} />
}
