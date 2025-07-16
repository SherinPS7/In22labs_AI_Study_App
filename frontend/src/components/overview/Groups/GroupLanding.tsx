// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "@/hooks/use-toast";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import JoinGroupModal from "@/components/group/JoinGroupModal";
// import CreateGroupModal from "@/components/group/CreateGroupModal";
// import { useNavigate } from "react-router-dom";
// import { getMyGroups, leaveGroup } from "@/api/grp";
// type Group = {
//   id: number;
//   name: string;
//   code: string;
//   creator_user_id: number;
// };

// const GroupLanding = () => {
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const navigate = useNavigate();

//   const fetchGroups = async () => {
//     try {
//          const res = await getMyGroups(); 
//       setGroups(res.data.groups || []);
//     } catch (err) {
//       toast({ title: "Error fetching groups", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLeave = async (groupId: number) => {
//     try {
//       await leaveGroup(groupId);
//       toast({ title: "Left group successfully" });
//       fetchGroups(); // Refresh
//     } catch (err) {
//       toast({ title: "Failed to leave group", variant: "destructive" });
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   return (
//     <motion.div
//       className="max-w-3xl mx-auto p-4 space-y-6"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h1 className="text-3xl font-bold text-center">Study Groups</h1>

//       {loading ? (
//         <p className="text-center text-muted-foreground">Loading...</p>
//       ) : groups.length === 0 ? (
//         <div className="text-center space-y-4">
//           <p className="text-muted-foreground">You are not in any groups yet.</p>
//           <div className="flex justify-center gap-4">
//             <Button onClick={() => setShowCreateModal(true)}>Create Group</Button>
//             <Button variant="outline" onClick={() => setShowJoinModal(true)}>Join Group</Button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <Button onClick={() => setShowCreateModal(true)}>+ Create Group</Button>
//             <Button variant="outline" onClick={() => setShowJoinModal(true)}>Join Group</Button>
//           </div>

//           {groups.map((group) => (
//             <Card key={group.id} className="shadow-lg rounded-2xl border border-gray-200">
//               <CardContent className="p-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-semibold">{group.name}</h2>
//                     <p className="text-muted-foreground text-sm">Code: {group.code}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="secondary"
//                       onClick={() => navigate(`/group/${group.id}`)}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleLeave(group.id)}
//                     >
//                       Leave
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       <JoinGroupModal open={showJoinModal} setOpen={setShowJoinModal} onSuccess={fetchGroups} />
//       <CreateGroupModal open={showCreateModal} setOpen={setShowCreateModal} onSuccess={fetchGroups} />
//     </motion.div>
//   );
// };

// export default GroupLanding;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JoinGroupModal from "@/components/group/JoinGroupModal";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import { useNavigate } from "react-router-dom";
import { getMyGroups, leaveGroup } from "@/api/grp";

type Group = {
  id: number;
  name: string;
  code: string;
  creator_user_id: number;
};

type GroupStatus = {
  group: Group;
  studyPlan: any | null;
};

const GroupLanding = () => {
  const [groups, setGroups] = useState<GroupStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await getMyGroups();
      setGroups(res.groups || []);
    } catch (err) {
      toast({ title: "Error fetching groups", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async (groupId: number) => {
    try {
      await leaveGroup(groupId);
      toast({ title: "Left group successfully" });
      fetchGroups(); // Refresh
    } catch (err) {
      toast({ title: "Failed to leave group", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <motion.div
      className="max-w-3xl mx-auto p-4 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-center">Study Groups</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : groups.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">You are not in any groups yet.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setShowCreateModal(true)}>Create Group</Button>
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>Join Group</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button onClick={() => setShowCreateModal(true)}>+ Create Group</Button>
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>Join Group</Button>
          </div>

          {groups.map(({ group, studyPlan }) => (
            <Card key={group.id} className="shadow-lg rounded-2xl border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="text-muted-foreground text-sm">Code: {group.code}</p>
                    {studyPlan ? (
                      <p className="text-sm text-green-600 mt-1">
                        Synced Plan: {studyPlan.plan_name}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-600 mt-1">No plan synced yet</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleLeave(group.id)}
                    >
                      Leave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <JoinGroupModal open={showJoinModal} setOpen={setShowJoinModal} onSuccess={fetchGroups} />
      <CreateGroupModal open={showCreateModal} setOpen={setShowCreateModal} onSuccess={fetchGroups} />
    </motion.div>
  );
};

export default GroupLanding;
