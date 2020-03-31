export default function judgeCurrentIndex(CurrentIndex, Questionslength) {
    return new Promise((resolve, reject) => {
        if (CurrentIndex < (Questionslength - 1)) {
            CurrentIndex = (CurrentIndex + 1)
            resolve({
                msg: 'Next',
                data: CurrentIndex
            })
        } else if (CurrentIndex = (Questionslength - 3)) {
            CurrentIndex = (CurrentIndex + 3)
            resolve({
                msg: 'getData',
                data: CurrentIndex
            })
        }
    })

}