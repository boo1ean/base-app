import { Button } from '@repo/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'

const tabs = [
  { value: 'tab-1', label: 'Tab 1' },
  { value: 'tab-2', label: 'Tab 2' },
  { value: 'tab-3', label: 'Tab 3' },
] as const

function alertRandomNumber() {
  alert(String(Math.random()))
}

export function TabbedActions() {
  return (
    <Tabs defaultValue="tab-1" className="w-full max-w-md text-left">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="flex flex-wrap gap-3">
            <Button onClick={alertRandomNumber}>
              Primary action
            </Button>
            <Button variant="secondary" onClick={alertRandomNumber}>
              Secondary action
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
