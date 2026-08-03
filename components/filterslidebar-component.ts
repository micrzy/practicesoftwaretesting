import {Page,Locator} from "@playwright/test"

/**
 * Represents the "Filter Sidebar" on the left side of the page.
 * Contains all filter controls including brand/category checkboxes and price range slider.
 */

export class FilterSlideBarComponent{

     readonly container:Locator;
     readonly maxSlider: Locator;

    constructor(readonly page:Page){
       this.container = this.page.locator('[data-test="filters"]')
       this.maxSlider = this.page.locator('[aria-label="ngx-slider-max"]');
    }

     async navigate(){
        this.page.goto('/')
    }

    // --- Brand / Category Checkboxes ---
    async checkOption(filterName:string){
         await this.container.getByRole('checkbox',{name:filterName}).check({force:true})

    }

    // --- Price Range Slider ---
    async setMaxPrice(max:number){
     await this.maxSlider.focus()
     while(true){
          const currentVal = Number(await this.maxSlider.getAttribute('aria-valuenow'))
          if(currentVal>max){
               await this.maxSlider.press('ArrowLeft')
          } else if(currentVal<max){
               await this.maxSlider.press('ArrowRight')
          }else{
               break
          }
     }
     
    }


}