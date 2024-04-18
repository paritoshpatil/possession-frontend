'use client'
import { AnimatedText } from "@/components/animatedText";
import { Button } from "@/components/ui/button";
import GlitchyText from "@/components/glitchyTest";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Check } from "lucide-react";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";
import { useFilter } from "@react-aria/i18n";
import { useListData } from "react-stately";

export default function Home() {

  const locationSuggestionsTEMP = [
    {
      value: "bedroom"
    },
    {
      value: "living room"
    },
    {
      value: "kitchen"
    }
  ]

  const containerSuggestionsTEMP = [
    {
      value: "wardrobe"
    },
    {
      value: "dresser"
    },
    {
      value: "main table"
    },
    {
      value: "tv set"
    },
    {
      value: "utensil cupboard"
    },
  ]

  const categorySuggestionsTEMP = [
    {
      value: "aromatics"
    },
    {
      value: "electronics"
    },
    {
      value: "skincare"
    },
  ]
  const inputPlaceholder: string[] = ["name", "description", "category", "cost", "warranty", "location", "container"]
  const [currentColumn, setCurrentColumn] = useState(0)
  const [itemText, setItemText] = useState("");
  const [currentColumnValue, setCurrentColumnValue] = useState("")
  const { startsWith } = useFilter({ sensitivity: "base" });

  let suggestions = useListData({
    initialItems: [{value: "start typing to see relevant suggestions"}],
    getKey: (item) => item.value,
    filter: (item, filterText) => item.value.startsWith(filterText)
  })


  const delimiter: string = "/"

  var animations1 = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 2
      }
    }
  };

  var animations2 = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 5,
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
        repeatDelay: 3
      }
    }
  };


  const itemInputChanged = (event: any) => {
    var count = event.split(delimiter).length - 1
    var x = event.substring(event.lastIndexOf("/") + 1);

    setCurrentColumnValue(x.trim())
    suggestions.setFilterText(x.trim())
    setItemText(event)

    if (count > 0) {
      setCurrentColumn(count)
      if (count == 2) {
        const result = categorySuggestionsTEMP.some(element1 => suggestions.items.some(element2 => element1.value === element2.value));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...categorySuggestionsTEMP)
        }
      }
      else if (count == 5) {
        const result = locationSuggestionsTEMP.some(element1 => suggestions.items.some(element2 => element1.value === element2.value));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...locationSuggestionsTEMP)
        }
      }
      else if (count == 6) {
        const result = containerSuggestionsTEMP.some(element1 => suggestions.items.some(element2 => element1.value === element2.value));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...containerSuggestionsTEMP)
        }
      }
      else {
        if(suggestions.items.length > 0)
          removeAllSuggestions()
      }
    }
    else {
      setCurrentColumn(0)
      removeAllSuggestions()
    }
  }

  function removeAllSuggestions() {
    suggestions.remove(...suggestions.items.map(item => item.value))
    suggestions.remove(...categorySuggestionsTEMP.map(item => item.value))
    suggestions.remove(...locationSuggestionsTEMP.map(item => item.value))
    suggestions.remove(...containerSuggestionsTEMP.map(item => item.value))
  }

  function itemSelectionChanged(event: any) {
    if(event) {
      setItemText(`${itemText.substring(0, itemText.lastIndexOf(delimiter)+1)}${event}/`)
      itemInputChanged(`${itemText.substring(0, itemText.lastIndexOf(delimiter)+1)}${event}/`)
    }
  }

  function getColumnPill(index: number, item: string) {
    // previous columns
    if (index < currentColumn)
      return (<Badge key={index} variant="default" className="text-sm ml-0 mr-2 bg-green-600 text-green-200">
        <Check height={16} width={16} className="m-0 p-0 mr-1" />
        {item}
      </Badge>)

    // current column
    if (index == currentColumn)
      return (<Badge key={index} variant="default" className="text-sm ml-0 mr-2">
        {item}
      </Badge>)

    // next columns
    if (index > currentColumn)
      return (<Badge key={index} variant="secondary" className="text-sm ml-0 mr-2">
        {item}
      </Badge>)

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/40">
      <div className="hero text-center w-[80%]">
        <p className="mb-0 text-muted-foreground">welcome to</p>
        <div className="animated-text-container">
          <AnimatedText
            text="possession"
            el="h1"
            animation={animations1}
            className="possession-header text-foreground"
          />
          <AnimatedText
            text="possession"
            el="h1"
            animation={animations2}
            className="possession-header-2 text-foreground"
          />
        </div>

        <GlitchyText
          text="the fastest home inventory application"
          changeable={['e', 'o', 'a', 'n', 't']}
        />
      </div>

      <div className="item-input flex w-full outline-none focus:outline-none items-center">
        <div className="item-input-placeholder absolute bottom-16 left-0 text-muted-foreground flex flex-row ml-0">
            {
              inputPlaceholder.map((item, index) => {
                return (
                  getColumnPill(index, item)
                )
              })
            }
          </div>
        <Autocomplete placeholder="add a new item"
          allowsCustomValue={true}
          onInputChange={(event) => itemInputChanged(event)}
          className=""
          inputValue={itemText}
          items={suggestions.items}
          allowsEmptyCollection={false}
          menuTrigger="focus"
          shouldCloseOnBlur={true}
          onSelectionChange={(event) => itemSelectionChanged(event)}
          selectedKey={""}
          // isLoading={true}
          onKeyDown={(e: any) => e.continuePropagation()}>
          {
            (suggestion) => 
              <AutocompleteItem key={suggestion.value}>
                {suggestion.value}
              </AutocompleteItem>
            
          }

        </Autocomplete>
      </div>
    </main>
  );
}