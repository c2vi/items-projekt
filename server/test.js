


class Test{
    constructor(arg1,arg2){
       this.hi=arg1;
       this.test=arg2;
    }
    testing1(){
        console.log(this.hi)
    }
    testing2(){
        console.log(this.test);
    }
}

let array = ["one","two","three","four"]


for (let i = 0; i < array.length; i++){
    console.log(array[i]);
    console.log("----------------------------------")

}

console.log(array)
