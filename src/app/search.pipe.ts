import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchProduct1: string): any {

    if(searchProduct1 == undefined){
      return value ;
    }

    else{
      var searchProduct = searchProduct1.toLocaleLowerCase().trim();
      let query
      value.data.length>37?query="Country":query="state"

      const searching = value.data.filter(element=>{
        let productSearch = element[query].substring(0, searchProduct.length);

        if (searchProduct === productSearch.toLocaleLowerCase().trim()){
          return element;
        }
      })
      return searching;
    }
  }

}
