export default function ModifyQuestionType(questionType) {
    switch (questionType) {
        case 0:
            return 'c1';
        case 1:
            return 'c2';
        case 2:
            return 'a1';
        case 3:
            return 'a2';
        case 4:
            return 'b1';
        case 5:
            return 'b2';
        default:
            return 'err'
    }
}