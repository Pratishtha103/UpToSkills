import { motion } from 'framer-motion'
import { Card } from '../Company_Dashboard/ui/card'
import { Button } from '../Company_Dashboard/ui/button'
import { Badge } from '../Company_Dashboard/ui/badge'
import { Calendar, Clock, Video, Phone, MoreHorizontal } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/* Mock data & helpers                                                        */
/* -------------------------------------------------------------------------- */

const mockInterviews = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    position: 'React Developer',
    date: '2024-07-20',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled',
  },
  {
    id: '2',
    candidateName: 'Mike Chen',
    position: 'Data Scientist',
    date: '2024-07-20',
    time: '2:00 PM',
    type: 'video',
    status: 'scheduled',
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    position: 'UI/UX Designer',
    date: '2024-07-21',
    time: '11:30 AM',
    type: 'phone',
    status: 'scheduled',
  },
]

const statusColors = {
  scheduled: 'bg-primary text-primary-foreground',
  completed: 'bg-success text-success-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
}

const typeIcons = {
  video: Video,
  phone: Phone,
  'in-person': Calendar,
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function InterviewsSection() {
  return (
    <motion.div
      id="upcoming-interviews" 
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground ">
          
          Upcoming Interviews
        </h2>
        <Button className="w-full sm:w-auto btn-primary">
          <Calendar className="w-6 h-6" />
          Schedule New Interview
        </Button>
      </div>

      {/* Interview cards */}
      <div className="grid gap-4">
        {mockInterviews.map((interview, index) => {
          const TypeIcon = typeIcons[interview.type]

          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-4 h-full flex flex-col border-2 border-transparent transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.5)] bg-gray-100  hover:bg-gray-150 rounded-2xl "
                style={{ borderStyle: 'solid',  }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderTopColor = '#F97316'
                  e.currentTarget.style.borderLeftColor = '#F97316'
                  e.currentTarget.style.borderBottomColor = '#3B82F6'
                  e.currentTarget.style.borderRightColor = '#3B82F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderTopColor = 'transparent'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                  e.currentTarget.style.borderRightColor = 'transparent'
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Candidate info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {interview.candidateName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base sm:text-lg">
                        {interview.candidateName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {interview.position}
                      </p>
                    </div>
                  </div>

                  {/* Date, time, status & actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full lg:w-auto">
                    {/* Date & time */}
                    <div className="flex flex-col text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(interview.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{interview.time}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-5 h-5 text-primary" />
                      <Badge
                        className={`${statusColors[interview.status]} capitalize`}
                      >
                        {interview.status}
                      </Badge>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                      >
                        Reschedule
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
