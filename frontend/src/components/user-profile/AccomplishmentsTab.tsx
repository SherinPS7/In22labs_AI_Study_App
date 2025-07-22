import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

interface Props {
  isOwnProfile: boolean;
  userId: number | string;
  userName: string;
}

interface Course {
  id: number;
  course_name: string;
  description?: string;
}

export default function AccomplishmentsTab({ isOwnProfile, userId, userName }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/profile/${userId}/accomplishments`)
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{isOwnProfile ? "Your" : `${userName}'s`} Accomplishments</CardTitle>
      </CardHeader>
      <CardContent>
        {isOwnProfile && (
          <p className="text-muted-foreground mb-4">
            Here are the courses you've successfully completed. Great job!
          </p>
        )}
        {loading ? (
          <p>Loading accomplishments...</p>
        ) : courses.length > 0 ? (
          <ul className="space-y-4">
            {courses.map(course => (
              <li
                key={course.id}
                className="border rounded-lg p-4 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="font-semibold text-lg">{course.course_name}</span>
                  {course.description && (
                    <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                  )}
                </div>
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    window.open(`http://localhost:3000/api/certificate/${course.id}`, "_blank");
                  }}
                >
                  View Certificate
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {isOwnProfile
              ? "You haven't passed any courses yet."
              : `${userName} hasn't shared any accomplishments yet.`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
