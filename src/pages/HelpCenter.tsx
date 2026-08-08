import { useState } from "react";
import { LifeBuoy, Mail, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "How do I create a new board?", a: "Click the '+' floating button or 'New Board' on the Boards page, give it a name, description, and pick a color theme." },
  { q: "How do I invite teammates?", a: "Go to the Team page and click 'Invite Member', or use the 'Invite' button on any board's header." },
  { q: "Can I customize task priorities?", a: "Yes — open any task and change its priority in the sidebar of the task detail modal." },
  { q: "How does drag-and-drop work?", a: "Grab the handle icon on a task card and drop it into another column to update its status instantly." },
  { q: "Is there a dark mode?", a: "Yes, toggle it from the sun/moon icon in the top navigation bar or under Settings → Appearance." },
  { q: "How do I track time on tasks?", a: "Open a task and use the Time Tracking section in the sidebar to log hours against the estimate." },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const filtered = FAQS.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
          <LifeBuoy className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">How can we help?</h1>
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search help articles..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <MessageCircle className="h-5 w-5 text-primary-600" />
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Chat with our support team in real time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Start chat</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Mail className="h-5 w-5 text-secondary-600" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Get a response within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">support@loop.io</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {filtered.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
