import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import CreateDoctor from './create-doctor'
import { useState } from 'react'

export default function CreateDoctorDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Doctor</DialogTitle>
          <DialogDescription>
            Create a new doctor to add appointments for
          </DialogDescription>
        </DialogHeader>
        <CreateDoctor onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
