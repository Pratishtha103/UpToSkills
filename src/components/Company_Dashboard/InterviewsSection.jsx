import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../Company_Dashboard/ui/card";
import { Button } from "../Company_Dashboard/ui/button";
import { Badge } from "../Company_Dashboard/ui/badge";
import { Input } from "../Company_Dashboard/ui/input";
import { Label } from "../Company_Dashboard/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Company_Dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Company_Dashboard/ui/dialog";
import { Calendar, Clock, Video, Phone, Trash } from "lucide-react";

const statusColors = {
  scheduled: "bg-primary text-primary-foreground",
  completed: "bg-green-500 text-white",
  cancelled: "bg-red-600 text-white",
};

const typeIcons = {
  video: Video,
  phone: Phone,
  "in-person": Calendar,
};

export default function InterviewsSection() {
  const [interviews, setInterviews] = useState([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    position: "",
    date: "",
    time: "",
    type: "",
  });
  const [editInterview, setEditInterview] = useState({
    id: "",
    date: "",
    time: "",
  });

  // ✅ Fetch all interviews
  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/interviews");
      const data = res.data || [];
      setInterviews(data);
      setInterviewCount(data.length);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // ✅ Add new interview
  const handleScheduleInterview = async () => {
    if (
      !newInterview.candidateName ||
      !newInterview.position ||
      !newInterview.date ||
      !newInterview.time ||
      !newInterview.type
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/interviews", newInterview);
      setInterviews([...interviews, res.data]);
      setInterviewCount((prev) => prev + 1);
      setIsModalOpen(false);
      setNewInterview({
        candidateName: "",
        position: "",
        date: "",
        time: "",
        type: "",
      });
    } catch (err) {
      console.error("Error scheduling interview:", err);
    }
  };

  // ✅ Delete interview
  const handleDeleteInterview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/interviews/${id}`);
      fetchInterviews();
    } catch (err) {
      console.error("Error deleting interview:", err);
    }
  };

  // ✅ Save edited interview (Reschedule)
  const handleEditSave = async () => {
    if (!editInterview.date || !editInterview.time) {
      alert("Please select new date and time.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/interviews/${editInterview.id}`,
        {
          date: editInterview.date,
          time: editInterview.time,
        }
      );
      setIsEditModalOpen(false);
      setEditInterview({ id: "", date: "", time: "" });
      fetchInterviews(); // Refresh data after update
    } catch (err) {
      console.error("Error updating interview:", err);
    }
  };

  return (
    <motion.div
      id="upcoming-interviews"
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white">
          Upcoming Interviews ({interviewCount})
        </h2>

        {/* Schedule New Interview Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule New Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Schedule New Interview</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {["candidateName", "position", "date", "time", "type"].map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right dark:text-gray-200 capitalize">
                    {field === "candidateName" ? "Candidate Name" : field}
                  </Label>
                  {field === "type" ? (
                    <Select
                      value={newInterview.type}
                      onValueChange={(value) =>
                        setNewInterview({ ...newInterview, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="in-person">In-person</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field}
                      type={field === "date" ? "date" : field === "time" ? "time" : "text"}
                      value={newInterview[field]}
                      onChange={(e) =>
                        setNewInterview({ ...newInterview, [field]: e.target.value })
                      }
                      className="col-span-3"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleInterview}>Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interview Cards */}
      <div className="grid gap-4">
        {interviews.map((interview, index) => {
          const TypeIcon = typeIcons[interview.type] || Calendar;
          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 h-full flex flex-col border-2 border-transparent transition-all duration-300 bg-gray-50 dark:bg-gray-800 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.4)] rounded-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {(interview.candidate_name || interview.candidateName)
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-white text-base sm:text-lg">
                        {interview.candidate_name || interview.candidateName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {interview.role || interview.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full lg:w-auto">
                    <div className="flex flex-col text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{interview.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-5 h-5 text-primary" />
                      <Badge
                        className={`${statusColors[interview.status?.toLowerCase()] || ""} capitalize`}
                      >
                        {interview.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => {
                          setEditInterview({
                            id: interview.id,
                            date: interview.date.split("T")[0],
                            time: interview.time,
                          });
                          setIsEditModalOpen(true);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        onClick={() => handleDeleteInterview(interview.id)}
                        variant="ghost"
                        size="icon"
                        className="px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:text-white"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ✅ Edit (Reschedule) Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[400px] dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Reschedule Interview</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right dark:text-gray-200">
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={editInterview.date}
                onChange={(e) =>
                  setEditInterview({ ...editInterview, date: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right dark:text-gray-200">
                Time
              </Label>
              <Input
                id="edit-time"
                type="time"
                value={editInterview.time}
                onChange={(e) =>
                  setEditInterview({ ...editInterview, time: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
