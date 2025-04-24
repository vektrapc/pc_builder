import { useEffect, useCallback, useState } from 'react'
import { useUI } from '@components/ui/context'
import { getRandomPairOfColors } from '@lib/colors'
import { array } from 'yup/lib/locale';
import http from 'handlers/api';
export const useBuildCart = (postData = {}) => {
  const { buildData, getBuildFromCart, buildCart } = useUI();
  const [buildCartData, setBuildCartData] = useState([]);
  var builds = [];
  useEffect(() => {
    let tempData = [];
    const fetchData = async (item) => {
      const data = await http.post("/get-configurator-pc-data", {
        enquiry_token: item.enquiry_token, 
        build_token:item.build_token
      });
      // tempData.push(data.data)
      getBuildFromCart(tempData)
    }
    const fetchBuildData = async (item) => {
     
      const {build_token, enquiry_token} = item
      const data = await http.post("/get-configurator-pc-data", {
        enquiry_token: enquiry_token, 
        // build_token:build_token
      });
      tempData.push(data.data)
      getBuildFromCart(tempData);
    }
 
    if(buildCart.length> 0) {
      buildCart.forEach((item) => {
        fetchData(item);
      })
    } else {
      //new
      let buildCartData = {};
      let build_tokens = [];
            let foundBuild = false
            let savedBuildCartData = localStorage.getItem("buildCartData")
            if(savedBuildCartData) {
              buildCartData = JSON.parse(savedBuildCartData)
          }
          if(Object.keys(buildCartData).length > 0) {
            fetchBuildData({enquiry_token: buildCartData['enquiry_token']});
            
          } else {
            getBuildFromCart([])
          }
      //finish
      // let buildsAddedToCart = localStorage.getItem("buildsAddedToCart");
      // const buildsAddedToCartParsed= buildsAddedToCart? JSON.parse(buildsAddedToCart):[]
      // if(buildsAddedToCartParsed.length> 0) {
      //   buildsAddedToCartParsed.forEach((item) => {
      //     fetchData(item);
      //   })
      // } else {
      //   getBuildFromCart([])
      // }
    }

  }, [buildCart])

  return {
    buildCart,
    getBuildFromCart,
    buildData
  }
}
