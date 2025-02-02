import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { CreateSlot } from './create-slot'

export default function CreateSlotDialog({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Slot</DialogTitle>
          <DialogDescription>
            Create a new appointment slot with recurrence options
          </DialogDescription>
        </DialogHeader>
        <CreateSlot />
      </DialogContent>
    </Dialog>
  )
}
