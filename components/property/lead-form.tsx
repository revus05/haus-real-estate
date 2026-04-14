"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { leadSchema, type LeadInput } from "@/lib/validations/lead"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface LeadFormProps {
  propertyId: string
  propertyTitle: string
}

export function LeadForm({ propertyId, propertyTitle }: LeadFormProps) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
      propertyId,
    },
  })

  async function onSubmit(values: LeadInput) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error("Не удалось отправить запрос. Попробуйте снова.")
      return
    }

    setSent(true)
    toast.success("Ваш запрос был отправлен!")
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) {
      // Reset after close
      setTimeout(() => {
        setSent(false)
        form.reset()
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Связаться с агентом
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Связаться с агентом</DialogTitle>
          <DialogDescription className="line-clamp-1">
            О: {propertyTitle}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-medium">Запрос отправлен!</p>
            <p className="text-sm text-muted-foreground">
              Агент свяжется с вами в ближайшее время.
            </p>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email или телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com или +375 29 XXX-XX-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сообщение (опционально)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Я интересуюсь этой недвижимостью…"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Отправить запрос
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
