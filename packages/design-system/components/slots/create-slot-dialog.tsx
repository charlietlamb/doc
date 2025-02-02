import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { CreateSlot } from './create-slot'
import { useState } from 'react'
export default function CreateSlotDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slot</DialogTitle>
          <DialogDescription>
            Create a new appointment slot with recurrence options
          </DialogDescription>
        </DialogHeader>
        <CreateSlot onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
