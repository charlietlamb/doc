import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import CreateDoctor from './create-doctor'

export default function CreateDoctorDialog({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Doctor</DialogTitle>
          <DialogDescription>
            Create a new doctor to add appointments for
          </DialogDescription>
        </DialogHeader>
        <CreateDoctor />
      </DialogContent>
    </Dialog>
  )
}
