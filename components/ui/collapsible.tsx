"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import {cn} from "@/lib/utils";
import React from "react";

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
    <CollapsiblePrimitive.CollapsibleContent
        ref={ref}
        className={cn('overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up', className)}
        {...props}
    />
));

CollapsibleContent.displayName = "CollapsibleContent";
CollapsibleTrigger.displayName = "CollapsibleTrigger";
Collapsible.displayName = "Collapsible";

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
