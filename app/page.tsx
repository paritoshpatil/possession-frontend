'use client'
import { AnimatedText } from "@/components/animatedText";
import { Button } from "@/components/ui/button";
import GlitchyText from "@/components/glitchyTest";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {useEffect, useState} from "react";
import {Check, Loader2} from "lucide-react";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/react";
import { useFilter } from "@react-aria/i18n";
import { useListData } from "react-stately";
import {userStore} from "@/lib/userStore";
import {Location} from "@/models/location";
import {Container} from "@/models/container";
import {Category} from "@/models/category";
import {getAllContainers, getCategoriesForUser, getContainersForLocation, getLocations} from "@/data/db-actions";
import {toast} from "sonner";

export default function Home() {

  const inputPlaceholder: string[] = ["name", "description", "category", "cost", "warranty", "location", "container"]
  const [currentColumn, setCurrentColumn] = useState(0)
  const [itemText, setItemText] = useState("");
  const [currentColumnValue, setCurrentColumnValue] = useState("")
  const { startsWith } = useFilter({ sensitivity: "base" });
  const {user} = userStore()

  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([])
  const [containerSuggestions, setContainerSuggestions] = useState<Container[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([])

  useEffect(() => {
    loadSuggestions()
  }, [user])

  async function loadSuggestions() {
    var locations = await getLocations(user?.id)
    if(locations.success && locations.data) {
      setLocationSuggestions([...locations.data])
    }

    var containers = await getAllContainers(user?.id)
    if(containers.success && containers.data) {
      setContainerSuggestions([...containers.data])
    }

    var categories = await getCategoriesForUser(user?.id)
    if(categories.success && categories.data) {
      setCategorySuggestions([...categories.data])
    }
  }

  function filterContainerSuggestionsForLocation(locationID: number) {
    return containerSuggestions.filter(container => container.location_id === locationID)
  }

  let suggestions = useListData({
    initialItems: [{name: "start typing to see relevant suggestions", id: -1}],
    getKey: (item) => item.id,
    filter: (item, filterText) => item.name.startsWith(filterText)
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
        const result = categorySuggestions.some(element1 => suggestions.items.some(element2 => element1.name === element2.name));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...categorySuggestions)
        }
      }
      else if (count == 5) {
        const result = locationSuggestions.some(element1 => suggestions.items.some(element2 => element1.name === element2.name));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...locationSuggestions)
        }
      }
      else if (count == 6) {
        // get id for current location
        const locationID: number = parseInt(event.split(delimiter)[5])

        const result = containerSuggestions.some(element1 => suggestions.items.some(element2 => element1.name === element2.name));
        if(!x && !result) {
          removeAllSuggestions()
          suggestions.append(...filterContainerSuggestionsForLocation(locationID))
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
    suggestions.remove(...suggestions.items.map(item => item.id))
    suggestions.remove(...categorySuggestions.map(item => item.id))
    suggestions.remove(...locationSuggestions.map(item => item.id))
    suggestions.remove(...containerSuggestions.map(item => item.id))
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

  function performValidation() {
    if(itemText.length < 1) {
      toast.error("item cannot be empty")
      return
    }

    var columns = itemText.split(delimiter)

    if(columns[0].length < 1) {
      toast.error("item name cannot be empty")
      return
    }

    if(columns[2].length < 1) {
      toast.error("category cannot be empty")
      return
    }

    if(columns[5].length < 1) {
      toast.error("location cannot be empty")
      return
    }

    if(columns[6].length < 1) {
      toast.error("container cannot be empty")
      return
    }

    toast.loading("adding new item", {
      duration: 3000
    })
  }

  function submitItem() {
      performValidation()
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
          onKeyDown={(e: any) => e.continuePropagation()}
          onKeyUp={(e: any) => {
            if(e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitItem()
          }}
          >
          {
            (suggestion) => 
              <AutocompleteItem key={suggestion.id} value={suggestion.id}>
                {suggestion.name}
              </AutocompleteItem>
            
          }

        </Autocomplete>
      </div>
    </main>
  );
}