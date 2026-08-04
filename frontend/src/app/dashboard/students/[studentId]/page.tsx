export default function StudentPage({ params }: { params: { studentId: string } }) {
  return <main><h1>Student {params.studentId}</h1></main>;
}
