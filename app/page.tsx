'use client'
import {AnimatedText} from "@/components/animatedText";
import GlitchyText from "@/components/glitchyTest";
import {Badge} from "@/components/ui/badge";
import {useEffect, useState} from "react";
import {Check} from "lucide-react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useFilter} from "@react-aria/i18n";
import {useListData} from "react-stately";
import {userStore} from "@/lib/userStore";
import {Location} from "@/models/location";
import {Container} from "@/models/container";
import {Category} from "@/models/category";
import {
  addCategory,
  addContainer,
  additem,
  addLocation,
  getAllContainers,
  getCategoriesForUser,
  getLocations
} from "@/data/db-actions";
import {toast} from "sonner";
import {Item} from "@/models/item";

export default function Home() {

  const inputPlaceholder: string[] = ["name", "description", "category", "cost", "warranty", "location", "container"]
  const [currentColumn, setCurrentColumn] = useState(0)
  const [itemText, setItemText] = useState("");
  const [currentColumnValue, setCurrentColumnValue] = useState("")
  const { startsWith } = useFilter({ sensitivity: "base" });
  const {user} = userStore()

  const [locations, setLocations] = useState<Location[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([])
  const [containerSuggestions, setContainerSuggestions] = useState<Container[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([])

  useEffect(() => {
    loadSuggestions()
  }, [user])

  async function loadSuggestions() {
    let response1 = await getLocations(user?.id)
    if(response1.success && response1.data) {
      setLocations([...response1.data])
      setLocationSuggestions([...response1.data])
    }

    let response2 = await getAllContainers(user?.id)
    if(response2.success && response2.data) {
      setContainers([...response2.data])
      setContainerSuggestions([...response2.data])
    }

    let response3 = await getCategoriesForUser(user?.id)
    if(response3.success && response3.data) {
      setCategories([...response3.data])
      setCategorySuggestions([...response3.data])
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

  async function performValidation() {
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

    let newLocationName: string = "";
    let newContainerName: string = "";
    let newCategoryName: string = "";
    let newMetadata = {}

    // if(isNaN(parseInt(columns[6]))) newContainerName = columns[6]
    // if(isNaN(parseInt(columns[2]))) newCategoryName = columns[2]
    // if(isNaN(parseInt(columns[5]))) newLocationName = columns[5]

    if(!containers.find((container: { id: number; }) => container.id === parseInt(columns[6]))) newContainerName = columns[6]
    if(!categories.find((category: { id: number; }) => category.id === parseInt(columns[2]))) newCategoryName = columns[2]
    if(!locations.find((location: { id: number; }) => location.id === parseInt(columns[5]))) newLocationName = columns[5]

    if(newContainerName.length > 1 || newCategoryName.length > 1 || newLocationName.length > 1) {
      return await createNewMetadata(newContainerName, newCategoryName, newLocationName, newLocationName.length > 1 ? "" : columns[5])
    }

    return false
  }

  async function createNewMetadata(newContainerName: string, newCategoryName: string, newLocationName: string, locationID: string) {
    let newCategoryID: number = -1
    let newLocationID: number = -1
    let newContainerID: number = -1

    const loadingToastID = toast.loading(`generating new categories, locations and containers`, { duration: 300 })
    if(newCategoryName.length > 1) {
        let response1 = await addCategory(newCategoryName, user?.id)
        if(response1.success && response1.data) {
          toast.success(`created category ${newCategoryName}`)
          newCategoryID = response1.data[0].id
        }
        else {
          toast.error(response1.message)
        }
    }

    if(newLocationName.length > 1) {
      let response2 = await addLocation(newLocationName, user?.id)
      if(response2.success && response2.data) {
        toast.success(`created location ${newLocationName}`)
        newLocationID = response2.data[0].id
        locationID = response2.data[0].id
      }
      else {
        toast.error(response2.message)
      }
    }

    if(newContainerName.length > 1) {
      let response3 = await addContainer(newContainerName, locationID, user?.id)
      if(response3.success && response3.data) {
        toast.success(`created container ${newContainerName}`)
        newContainerID = response3.data[0].id
      }
      else {
        toast.error(response3.message)
      }
    }

    toast.dismiss(loadingToastID)

    return {
      newCategoryID: newCategoryID,
      newLocationID: newLocationID,
      newContainerID: newContainerID
    }
  }

  async function submitItem() {
      let newMetadata = await performValidation()
      const columns = itemText.split(delimiter)
      let newItem: Item = {
        name: columns[0],
        description: columns[1],
        category_id: newMetadata && newMetadata?.newCategoryID > -1 ? newMetadata.newCategoryID : parseInt(columns[2]),
        original_price: parseInt(columns[3]),
        purchase_date: new Date(),
        warranty_info: columns[4],
        location_id: newMetadata && newMetadata?.newLocationID > -1 ? newMetadata.newLocationID : parseInt(columns[5]),
        container_id: newMetadata && newMetadata?.newContainerID > -1 ? newMetadata.newContainerID : parseInt(columns[6])
      }

      const loadingToastID = toast.loading(`adding item to the database`, { duration: 300 })
      const response = await additem(newItem, user?.id)
      if(response.success && response.data) {
        toast.dismiss(loadingToastID)
        toast.success(`item added to the database`)
        setItemText("")
        setCurrentColumn(0)
        setCurrentColumnValue("")
      }
      else {
        toast.dismiss(loadingToastID)
        toast.error(response.message)
      }

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
            e.continuePropagation();
            if(e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitItem();
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