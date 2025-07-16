// // src/pages/group/GroupDetails.tsx

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// //import axios from "axios";
// import { toast } from "@/hooks/use-toast";
// import { Card, CardContent } from "@/components/ui/card";
// import { getGroupMembers, getGroupStatus } from "@/api/grp";
// type Member = {
//   id: number;
//   first_name: string;
//   last_name: string;
//   mobile: string;
//   completed: number;
// };

// type StudyPlan = {
//   plan_name: string;
//   start_date: string;
//   end_date: string;
//   study_time: number;
//   course_count: number;
// };

// export default function GroupDetails() {
//   const { id } = useParams();
//   const [members, setMembers] = useState<Member[]>([]);
//   const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
//   const [groupName, setGroupName] = useState("");
//   const [loading, setLoading] = useState(true);

// //   const fetchData = async () => {
// //     try {
// //       const groupId = Number(id);
// //       if (isNaN(groupId)) throw new Error("Invalid group ID");

// //       const [resMembers, resStatus] = await Promise.all([
// //         axios.get(`/group/${groupId}/members`),
// //         axios.get(`/group/mystatus`)
// //       ]);

// //       console.log("🔍 Members API:", resMembers.data);
// //       console.log("🔍 Status API:", resStatus.data);

// //       const groupsData = resStatus.data.groups;
// //       if (!Array.isArray(groupsData)) throw new Error("Groups data is not an array");

// //       const matchedGroup = groupsData.find((g: any) => g.group?.id === groupId);
// //       if (!matchedGroup) throw new Error("Group not found in your group list");

// //       setGroupName(matchedGroup.group.name || "Unnamed Group");
// //       setStudyPlan(matchedGroup.studyPlan || null);
// //       setMembers(resMembers.data.members || []);
// //     } catch (err: any) {
// //       console.error("❌ GroupDetails fetch error:", err);
// //       toast({
// //         title: "Failed to load group data",
// //         description: err?.message || "Something went wrong",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// // const fetchData = async () => {
// //   try {
// //     const groupId = Number(id);
// //     if (isNaN(groupId)) throw new Error("Invalid group ID");

// //     const [resMembers, resStatus] = await Promise.all([
// //       getGroupMembers(groupId),
// //       getGroupStatus(),
// //     ]);

// //     console.log("🔍 Members API:", resMembers);
// //     console.log("🔍 Status API:", resStatus);

// //     const groupData = resStatus.group;
// //     if (!groupData || groupData.id !== groupId) {
// //       throw new Error("You're not a member of this group");
// //     }

// //     setGroupName(groupData.name || "Unnamed Group");
// //     setStudyPlan(resStatus.studyPlan || null);
// //     setMembers(resMembers.members || []);
// //   } catch (err: any) {
// //     console.error("❌ GroupDetails fetch error:", err);
// //     toast({
// //       title: "Failed to load group data",
// //       description: err.message || "Something went wrong",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// // const fetchData = async () => {
// //   try {
// //     const groupId = Number(id);
// //     if (!groupId || isNaN(groupId)) {
// //       throw new Error("Invalid group ID in URL");
// //     }

// //     // Fetch members and group status in parallel
// //     const [resMembers, resStatus] = await Promise.all([
// //       getGroupMembers(groupId),
// //       getGroupStatus(),
// //     ]);

// //     console.log("🔍 Group Members Response:", resMembers);
// //     console.log("🔍 Group Status Response:", resStatus);

// //     const groupInfo = resStatus?.group;

// //     // Validate if the user is part of the group
// //     if (!groupInfo || groupInfo.id !== groupId) {
// //       throw new Error("You're not a member of this group");
// //     }

// //     // Set state safely
// //     setGroupName(groupInfo.name || "Unnamed Group");
// //     setStudyPlan(resStatus.studyPlan || null);
// //     setMembers(Array.isArray(resMembers.members) ? resMembers.members : []);
// //   } catch (err: any) {
// //     console.error("❌ GroupDetails fetch error:", err);
// //     toast({
// //       title: "Failed to load group data",
// //       description: err?.message || "An unexpected error occurred",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// const fetchData = async () => {
//   try {
//     const groupId = Number(id);
//     if (!groupId || isNaN(groupId)) {
//       throw new Error("Invalid group ID in URL");
//     }

//     const [resMembers, resStatus] = await Promise.all([
//       getGroupMembers(groupId),
//       getGroupStatus(),
//     ]);

//     console.log("🔍 Group Members Response:", resMembers);
//     console.log("🔍 Group Status Response:", resStatus);

//     // Find the matching group inside the groups array
//     const matchedGroup = resStatus.groups?.find(
//       (g: any) => g.group?.id === groupId
//     );

//     if (!matchedGroup) {
//       throw new Error("You're not a member of this group");
//     }

//     setGroupName(matchedGroup.group.name || "Unnamed Group");
//     setStudyPlan(matchedGroup.studyPlan || null);
//     setMembers(Array.isArray(resMembers.members) ? resMembers.members : []);
//   } catch (err: any) {
//     console.error("❌ GroupDetails fetch error:", err);
//     toast({
//       title: "Failed to load group data",
//       description: err?.message || "Something went wrong",
//       variant: "destructive",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto p-6 space-y-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h1 className="text-3xl font-bold text-center">Group: {groupName}</h1>

//       {loading ? (
//         <p className="text-center text-muted-foreground">Loading group details...</p>
//       ) : (
//         <>
//           {studyPlan && (
//             <Card>
//               <CardContent className="p-4 space-y-2">
//                 <h2 className="text-lg font-semibold">Shared Study Plan</h2>
//                 <p>Plan: {studyPlan.plan_name}</p>
//                 <p>Start: {studyPlan.start_date}</p>
//                 <p>End: {studyPlan.end_date}</p>
//                 <p>Study Time: {studyPlan.study_time} mins/day</p>
//                 <p>Courses: {studyPlan.course_count}</p>
//               </CardContent>
//             </Card>
//           )}

//           <Card>
//             <CardContent className="p-4">
//               <h2 className="text-lg font-semibold mb-2">Members</h2>
//               <ul className="space-y-2">
//                 {members.length > 0 ? (
//                   members.map((m) => (
//                     <li
//                       key={m.id}
//                       className="border p-3 rounded-xl flex justify-between"
//                     >
//                       <div>
//                         <p className="font-medium">
//                           {m.first_name} {m.last_name}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           {m.mobile}
//                         </p>
//                       </div>
//                       <span className="text-sm font-semibold">
//                         ✅ {m.completed} sessions
//                       </span>
//                     </li>
//                   ))
//                 ) : (
//                   <p className="text-muted-foreground">No members yet.</p>
//                 )}
//               </ul>
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </motion.div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { getGroupMembers, getGroupStatus } from "@/api/grp";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  completed: number;
};

type StudyPlan = {
  plan_name: string;
  start_date: string;
  end_date: string;
  study_time: number;
  course_count: number;
};

export default function GroupDetails() {
  const { id } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const groupId = Number(id);
      if (!groupId || isNaN(groupId)) throw new Error("Invalid group ID");

      const [resMembers, resStatus] = await Promise.all([
        getGroupMembers(groupId),
        getGroupStatus(),
      ]);

      console.log("🔍 Group Members Response:", resMembers);
      console.log("🔍 Group Status Response:", resStatus);

      const matchedGroup = resStatus.groups?.find(
        (g: any) => g.group?.id === groupId
      );

      if (!matchedGroup) {
        throw new Error("You're not a member of this group");
      }

      setGroupName(matchedGroup.group.name || "Unnamed Group");
      setStudyPlan(matchedGroup.studyPlan || null);
      setMembers(Array.isArray(resMembers.members) ? resMembers.members : []);
    } catch (err: any) {
      console.error("❌ GroupDetails fetch error:", err);
      toast({
        title: "Failed to load group data",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-center">Group: {groupName}</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading group details...</p>
      ) : (
        <>
          {studyPlan && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">Shared Study Plan</h2>
                <p>📘 Plan: {studyPlan.plan_name}</p>
                <p>📅 Start: {studyPlan.start_date}</p>
                <p>📅 End: {studyPlan.end_date}</p>
                <p>⏱️ Study Time: {studyPlan.study_time} mins/day</p>
                <p>📚 Courses: {studyPlan.course_count}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Members</h2>

              {members.length === 0 ? (
                <p className="text-muted-foreground">No members yet.</p>
              ) : (
                <ul className="space-y-2">
                  {members.map((m) => (
                    <li
                      key={m.id}
                      className="border p-3 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {m.first_name || "Unknown"} {m.last_name || ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📞 {m.mobile || "N/A"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        ✅ {m.completed} sessions
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
