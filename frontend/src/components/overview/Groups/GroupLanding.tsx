// // import { useEffect, useState } from "react";
// // import { motion } from "framer-motion";
// // import { toast } from "@/hooks/use-toast";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import JoinGroupModal from "@/components/group/JoinGroupModal";
// // import CreateGroupModal from "@/components/group/CreateGroupModal";
// // import { useNavigate } from "react-router-dom";
// // import { getMyGroups, leaveGroup ,deleteGroup} from "@/api/grp";

// // type GroupStatus = {
// //   id: number;
// //   group_name: string;
// //   join_code: string;
// //   created_by: number;
// //   createdAt: string;
// //   isAdmin: boolean;
// //   studyPlan?: any | null;
// // };

// // const GroupLanding = () => {
// //   const [createdGroups, setCreatedGroups] = useState<GroupStatus[]>([]);
// //   const [joinedGroups, setJoinedGroups] = useState<GroupStatus[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showJoinModal, setShowJoinModal] = useState(false);
// //   const [showCreateModal, setShowCreateModal] = useState(false);
// //   const navigate = useNavigate();

// //   const fetchGroups = async () => {
// //     try {
// //       const res = await getMyGroups();
// //       const allGroups: GroupStatus[] = res.groups || [];
// //       const myId = res.userId;
// //       setCreatedGroups(allGroups.filter(g => g.created_by === myId));
// //       setJoinedGroups(allGroups.filter(g => g.created_by !== myId));
// //     } catch (err) {
// //       toast({ title: "Error fetching groups", variant: "destructive" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLeave = async (groupId: number) => {
// //     try {
// //       await leaveGroup(groupId);
// //       toast({ title: "Left group successfully" });
// //       fetchGroups();
// //     } catch {
// //       toast({ title: "Failed to leave group", variant: "destructive" });
// //     }
// //   };

// //   useEffect(() => {
// //     fetchGroups();
// //     // eslint-disable-next-line
// //   }, []);

// //   return (
// //     <motion.div
// //       className="max-w-5xl mx-auto p-4 space-y-8"
// //       initial={{ opacity: 0, y: 30 }}
// //       animate={{ opacity: 1, y: 0 }}
// //     >
// //       <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <h1 className="text-3xl font-extrabold text-center sm:text-left text-white drop-shadow-sm tracking-tight">
// //           My Study Groups
// //         </h1>
// //         <div className="flex gap-3 justify-center">
// //           <Button size="lg" onClick={() => setShowCreateModal(true)}>
// //             + Create Group
// //           </Button>
// //           <Button
// //             size="lg"
// //             variant="outline"
// //             onClick={() => setShowJoinModal(true)}
// //             className="border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 hover:text-green-900 transition-colors"
// //           >
// //             Join Group
// //           </Button>
// //         </div>
// //       </header>

// //       {loading ? (
// //         <p className="text-center text-muted-foreground py-12">Loading groups...</p>
// //       ) : createdGroups.length === 0 && joinedGroups.length === 0 ? (
// //         <div className="flex flex-col gap-5 items-center mt-12">
// //           <span className="text-muted-foreground text-xl mb-1">
// //             You are not in any groups yet.
// //           </span>
// //         </div>
// //       ) : (
// //         <div className="space-y-10">
// //           {/* Created Groups */}
// //           {createdGroups.length > 0 && (
// //             <section>
// //               <h2 className="text-xl font-bold mb-3 text-green-400">Created Groups</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //                 {createdGroups.map((group) => (
// //                   <Card
// //                     key={group.id}
// //                     className="bg-[#121d18] border border-green-700/40 shadow-lg rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
// //                   >
// //                     <CardContent className="p-5">
// //                       <div className="flex justify-between items-center mb-2">
// //                         <div>
// //                           <div className="text-lg font-bold text-green-200">{group.group_name}</div>
// //                           <div className="text-xs text-green-600 mt-0.5">
// //                             Created: {new Date(group.createdAt).toLocaleDateString()}
// //                           </div>
// //                           <div className="flex items-center gap-2 mt-1">
// //                             <span className="text-xs bg-green-100 text-green-700 py-0.5 px-2 rounded">
// //                               Code: {group.join_code}
// //                             </span>
// //                             <span className="text-xs bg-green-600 text-white px-2 rounded">
// //                               Admin
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <Button
// //                           size="sm"
// //                           onClick={() => navigate(`/group/${group.id}`)}
// //                           className="ml-auto"
// //                         >
// //                           View
// //                         </Button>
// //                         <Button
// //   size="sm"
// //   variant="destructive"
// //   onClick={async () => {
// //     if (window.confirm("Are you sure you want to delete this group? This cannot be undone.")) {
// //       try {
// //         await deleteGroup(group.id);
// //         toast({ title: "Group deleted" });
// //         fetchGroups();
// //       } catch(e) {
// //         toast({ title: "Failed to delete group", variant: "destructive" });
// //       }
// //     }
// //   }}
// // >
// //   Delete
// // </Button>
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 ))}
// //               </div>
// //             </section>
// //           )}

// //           {/* Joined Groups */}
// //           {joinedGroups.length > 0 && (
// //             <section>
// //               <h2 className="text-xl font-bold mb-3 text-green-300">Joined Groups</h2>
// //               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //                 {joinedGroups.map((group) => (
// //                   <Card
// //                     key={group.id}
// //                     className="bg-[#0f2017] border border-green-500/40 shadow-xl rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
// //                   >
// //                     <CardContent className="p-5">
// //                       <div className="flex justify-between items-center mb-2">
// //                         <div>
// //                           <div className="text-lg font-bold text-green-100">{group.group_name}</div>
// //                           <div className="text-xs text-green-700 mt-0.5">
// //                             Joined: {new Date(group.createdAt).toLocaleDateString()}
// //                           </div>
// //                           <div className="flex items-center gap-2 mt-1">
// //                             <span className="text-xs bg-green-50 text-green-800 py-0.5 px-2 rounded">
// //                               Code: {group.join_code}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <div className="ml-auto flex gap-2">
// //                           <Button
// //                             size="sm"
// //                             variant="outline"
// //                             className="border-green-700 text-green-800 hover:text-green-900 hover:bg-green-50"
// //                             onClick={() => navigate(`/group/${group.id}`)}
// //                           >
// //                             View
// //                           </Button>
// //                           <Button
// //                             size="sm"
// //                             variant="destructive"
// //                             onClick={() => handleLeave(group.id)}
// //                           >
// //                             Leave
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 ))}
// //               </div>
// //             </section>
// //           )}
// //         </div>
// //       )}

// //       <JoinGroupModal open={showJoinModal} setOpen={setShowJoinModal} onSuccess={fetchGroups} />
// //       <CreateGroupModal open={showCreateModal} setOpen={setShowCreateModal} onSuccess={fetchGroups} />
// //     </motion.div>
// //   );
// // };

// // export default GroupLanding;
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import JoinGroupModal from "@/components/group/JoinGroupModal";
// import CreateGroupModal from "@/components/group/CreateGroupModal";
// import { useNavigate } from "react-router-dom";
// import { getMyGroups, leaveGroup, deleteGroup } from "@/api/grp";

// type GroupStatus = {
//   id: number;
//   group_name: string;
//   join_code: string;
//   created_by: number;
//   createdAt: string;
//   isAdmin: boolean;
//   studyPlan?: any | null;
// };

// const GroupLanding = () => {
//   const [createdGroups, setCreatedGroups] = useState<GroupStatus[]>([]);
//   const [joinedGroups, setJoinedGroups] = useState<GroupStatus[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const navigate = useNavigate();

//   const fetchGroups = async () => {
//     try {
//       const res = await getMyGroups();
//       const allGroups: GroupStatus[] = res.groups || [];
//       const myId = res.userId;
//       setCreatedGroups(allGroups.filter(g => g.created_by === myId));
//       setJoinedGroups(allGroups.filter(g => g.created_by !== myId));
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
//       fetchGroups();
//     } catch {
//       toast({ title: "Failed to leave group", variant: "destructive" });
//     }
//   };

//   const handleDelete = async (groupId: number) => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete this group? This cannot be undone."
//       )
//     ) {
//       try {
//         await deleteGroup(groupId);
//         toast({ title: "Group deleted" });
//         fetchGroups();
//       } catch (e) {
//         toast({ title: "Failed to delete group", variant: "destructive" });
//       }
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <motion.div
//       className="max-w-6xl mx-auto p-4 space-y-8"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//         <h1 className="text-3xl font-extrabold text-center md:text-left text-white drop-shadow-sm tracking-tight">
//           My Study Groups
//         </h1>
//         <div className="flex gap-3 justify-center md:justify-end">
//           <Button size="lg" onClick={() => setShowCreateModal(true)}>
//             + Create Group
//           </Button>
//           <Button
//             size="lg"
//             variant="outline"
//             onClick={() => setShowJoinModal(true)}
//             className="border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 hover:text-green-900 transition-colors"
//           >
//             Join Group
//           </Button>
//         </div>
//       </header>

//       {loading ? (
//         <p className="text-center text-muted-foreground py-12">
//           Loading groups...
//         </p>
//       ) : createdGroups.length === 0 && joinedGroups.length === 0 ? (
//         <div className="flex flex-col gap-5 items-center mt-12">
//           <span className="text-muted-foreground text-xl mb-1">
//             You are not in any groups yet.
//           </span>
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {/* Created Groups */}
//           {createdGroups.length > 0 && (
//             <section>
//               <h2 className="text-xl font-bold mb-3 text-green-400">
//                 Created Groups
//               </h2>
//               <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
//                 {createdGroups.map((group) => (
//                   <Card
//                     key={group.id}
//                     className="bg-[#121d18] border border-green-700/40 shadow-lg rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
//                   >
//                     <CardContent className="p-5">
//                       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
//                         <div>
//                           <div className="text-lg font-bold text-green-200">
//                             {group.group_name}
//                           </div>
//                           <div className="text-xs text-green-600 mt-0.5">
//                             Created:{" "}
//                             {new Date(group.createdAt).toLocaleDateString()}
//                           </div>
//                           <div className="flex items-center gap-2 mt-1 flex-wrap">
//                             <span className="text-xs bg-green-100 text-green-700 py-0.5 px-2 rounded">
//                               Code: {group.join_code}
//                             </span>
//                             <span className="text-xs bg-green-600 text-white px-2 rounded">
//                               Admin
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex gap-2 mt-3 sm:mt-0">
//                           <Button
//                             size="sm"
//                             onClick={() => navigate(`/group/${group.id}`)}
//                           >
//                             View
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleDelete(group.id)}
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Joined Groups */}
//           {joinedGroups.length > 0 && (
//             <section>
//               <h2 className="text-xl font-bold mb-3 text-green-300">
//                 Joined Groups
//               </h2>
//               <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
//                 {joinedGroups.map((group) => (
//                   <Card
//                     key={group.id}
//                     className="bg-[#0f2017] border border-green-500/40 shadow-xl rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
//                   >
//                     <CardContent className="p-5">
//                       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
//                         <div>
//                           <div className="text-lg font-bold text-green-100">
//                             {group.group_name}
//                           </div>
//                           <div className="text-xs text-green-700 mt-0.5">
//                             Joined:{" "}
//                             {new Date(group.createdAt).toLocaleDateString()}
//                           </div>
//                           <div className="flex items-center gap-2 mt-1 flex-wrap">
//                             <span className="text-xs bg-green-50 text-green-800 py-0.5 px-2 rounded">
//                               Code: {group.join_code}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex gap-2 mt-3 sm:mt-0">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             className="border-green-700 text-green-800 hover:text-green-900 hover:bg-green-50"
//                             onClick={() => navigate(`/group/${group.id}`)}
//                           >
//                             View
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleLeave(group.id)}
//                           >
//                             Leave
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
//           )}
//         </div>
//       )}

//       <JoinGroupModal
//         open={showJoinModal}
//         setOpen={setShowJoinModal}
//         onSuccess={fetchGroups}
//       />
//       <CreateGroupModal
//         open={showCreateModal}
//         setOpen={setShowCreateModal}
//         onSuccess={fetchGroups}
//       />
//     </motion.div>
//   );
// };

// export default GroupLanding;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import JoinGroupModal from "@/components/group/JoinGroupModal";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import { useNavigate } from "react-router-dom";
import { getMyGroups, leaveGroup, deleteGroup } from "@/api/grp";

type GroupStatus = {
  id: number;
  group_name: string;
  join_code: string;
  created_by: number;
  createdAt: string;
  isAdmin: boolean;
  studyPlan?: any | null;
};

const GroupLanding = () => {
  const [createdGroups, setCreatedGroups] = useState<GroupStatus[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await getMyGroups();
      const allGroups: GroupStatus[] = res.groups || [];
      const myId = res.userId;
      setCreatedGroups(allGroups.filter(g => g.created_by === myId));
      setJoinedGroups(allGroups.filter(g => g.created_by !== myId));
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
      fetchGroups();
    } catch {
      toast({ title: "Failed to leave group", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteGroupId) return;
    try {
      await deleteGroup(deleteGroupId);
      toast({ title: "Group deleted" });
      setDeleteGroupId(null);
      fetchGroups();
    } catch (e) {
      toast({ title: "Failed to delete group", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <h1 className="text-3xl font-extrabold text-center md:text-left text-white drop-shadow-sm tracking-tight">
          My Study Groups
        </h1>
        <div className="flex gap-3 justify-center md:justify-end">
          <Button size="lg" onClick={() => setShowCreateModal(true)}>
            + Create Group
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowJoinModal(true)}
            className="border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 hover:text-green-900 transition-colors"
          >
            Join Group
          </Button>
        </div>
      </header>

      {loading ? (
        <p className="text-center text-muted-foreground py-12">
          Loading groups...
        </p>
      ) : createdGroups.length === 0 && joinedGroups.length === 0 ? (
        <div className="flex flex-col gap-5 items-center mt-12">
          <span className="text-muted-foreground text-xl mb-1">
            You are not in any groups yet.
          </span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Created Groups */}
          {createdGroups.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-green-400">
                Created Groups
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {createdGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="bg-[#121d18] border border-green-700/40 shadow-lg rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
                        <div>
                          <div className="text-lg font-bold text-green-200">
                            {group.group_name}
                          </div>
                          <div className="text-xs text-green-600 mt-0.5">
                            Created:{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-green-100 text-green-700 py-0.5 px-2 rounded">
                              Code: {group.join_code}
                            </span>
                            <span className="text-xs bg-green-600 text-white px-2 rounded">
                              Admin
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/group/${group.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteGroupId(group.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Joined Groups */}
          {joinedGroups.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-green-300">
                Joined Groups
              </h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {joinedGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="bg-[#0f2017] border border-green-500/40 shadow-xl rounded-xl transition hover:-translate-y-1 hover:shadow-2xl duration-200"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
                        <div>
                          <div className="text-lg font-bold text-green-100">
                            {group.group_name}
                          </div>
                          <div className="text-xs text-green-700 mt-0.5">
                            Joined:{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-green-50 text-green-800 py-0.5 px-2 rounded">
                              Code: {group.join_code}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-700 text-green-800 hover:text-green-900 hover:bg-green-50"
                            onClick={() => navigate(`/group/${group.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
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
            </section>
          )}
        </div>
      )}

      <Dialog open={deleteGroupId !== null} onOpenChange={v => !v && setDeleteGroupId(null)}>
        <DialogContent className="max-w-sm rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold mb-3">Delete Group?</h2>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete this group? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteGroupId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <JoinGroupModal
        open={showJoinModal}
        setOpen={setShowJoinModal}
        onSuccess={fetchGroups}
      />
      <CreateGroupModal
        open={showCreateModal}
        setOpen={setShowCreateModal}
        onSuccess={fetchGroups}
      />
    </motion.div>
  );
};

export default GroupLanding;
