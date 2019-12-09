package Day14;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Scanner;

public class InputData {
    public static void main(String[] args) {
        /*
         *   程序的运行是一个死循环，只有满足提示功能选择   输出 0 才能结束运行
         *   查询单条记录以及所有记录时不需要输入0 来结束程序，只需打印结束 功能选择时输入0 才能退出
         *   在插入信息时 若想结束运行，只需要在一条新的信息内，输入 0  保持0是一个独立的字符就可以退出
         * */
        System.out.println("你需要做什么，我能提供以下功能\n");
        SelectShow();
        HashMap<Integer, Commodity> hashMap = new HashMap<>();
        while (true) {
            Scanner scanner = new Scanner(System.in);
            String next = scanner.nextLine();
            if (next.equals("1")) {
                System.out.println("你选择了录入数据");
                InputData(hashMap);                     //向hashMap里面添加数据
                System.out.println("你结束了输入，请选择更多功能：");
                SelectShow();                           //提示用户选择相应的功能
            }
            if (next.equals("2")) {
                System.out.println("你选择了数据查询");
//                ShowInput(hashMap);                     //根据某一商品名 查询
                LamadaOnlyOutput(hashMap);               // Lamada 打印某个商品信息
                System.out.println("你查询了一个商品的信息，请选择更多功能：");
                SelectShow();
            }
            if (next.equals("3")) {
                System.out.println("你选择了打印全部数据");
//                OutputAll(hashMap);                       // iterator 打印所有的已存入的信息
                LamadaShow(hashMap);                       //Lamada  打印所有信息
                System.out.println("你选择了打印全部信息，请选择更多功能：");
                SelectShow();
            }
            if (next.equals("0")) {                     //结束程序的运行
                System.out.println("成功退出程序!");
                break;
            }
        }

    }

    private static void SelectShow() {
        System.out.println("功能如下，输入对应的数字选择操作：");
        System.out.println("1:录入数据");
        System.out.println("2:数据查询");
        System.out.println("3:打印所有数据");
        System.out.println("0:退出程序\n");
        System.out.println("==========================");
        System.out.println("请输入：");
    }

    //  在输入时，只需保持新输入的信息内有一个单独的 0 即可退出
    private static void InputData(HashMap hashMap) {
        Scanner scanner = new Scanner(System.in);
        /*
         *   在输入信息时，可以多次输入，所以使用循环，只有在满足输入的单独输入一个 0 才退出输入
         *   考虑到用户可能不小心退出了输入信息，可再次选择输入信息来新添加信息
         *   在出于懒得情况下，只做了一个关于编号的简单验证
         *       即在 hashMap 中如果编号已经存在，会提示编号已经存在，返回功能选择
         *           若需重新输入请选择相应的功能
         *
         * */
        a:
        while (true) {
            String next1 = scanner.nextLine();
            String[] split = next1.split(",|\\s+|，");
            for (int i = 0; i < split.length; i++) {
                if (split[i].equals("0")) {
                    break a;
                } else if (hashMap.containsKey(Integer.parseInt(split[0]))) {
                    System.out.println("编号已存在，请重新选择功能：");
                    break a;
                } else {                    //Commodity 是一个商品类， 信息传入构造中即可
                    Commodity commodity = new Commodity(Integer.parseInt(split[0]), split[1], Double.parseDouble(split[2]), split[3]);
                    hashMap.put(commodity.getID(), commodity);// 将编号作为key ，Commodity 类作为value存入hashMap中
                    break;
                }
            }
        }
    }

    //Lamada 打印信息
    private static void LamadaShow(HashMap<Integer, Commodity> hashMap) {
        hashMap.forEach((k, v) -> System.out.println("编号: " + k + "," +
                "名称: " + v.getName() + ", " +
                "单价: " + v.getPrice() + ", " +
                "出版社: " + v.getPress()));
    }

    //打印使用迭代器遍历hashMap  打印所有信息
    private static void OutputAll(HashMap<Integer, Commodity> hashMap) {
        Iterator<Integer> iterator1 = hashMap.keySet().iterator();
        while (iterator1.hasNext()) {
            Integer next = iterator1.next();
            System.out.println("编号: " + hashMap.get(next).getID() + "," +
                    "名称: " + hashMap.get(next).getName() + ", " +
                    "单价: " + hashMap.get(next).getPrice() + ", " +
                    "出版社: " + hashMap.get(next).getPress());
        }
    }


    //Lamada 打印某个信息
    private static void LamadaOnlyOutput(HashMap<Integer, Commodity> hashMap) {
        System.out.println("请输入需要查询的商品：");
        Scanner scanner1 = new Scanner(System.in);
        String next = scanner1.next();
        hashMap.forEach((k, v) -> {
            if (v.getName().equals(next)) {
                System.out.println("编号: " + v.getID() + "," +
                        "名称: " + v.getName() + ", " +
                        "单价: " + v.getPrice() + ", " +
                        "出版社: " + v.getPress());
                return;
            } else {
                System.out.println("不存在这件商品哟！");
                return;
            }
        });
    }
    private static void ShowInput(HashMap<Integer, Commodity> hashMap) {
        //根据输入的商品名 查询hashMap中是否存在相同名的商品
        //      如果存在，就返回他的所有信息
        //      不存在就返回不存在
        System.out.println("请输入需要查询的商品：");
        Scanner scanner1 = new Scanner(System.in);
        String next = scanner1.next();
        for (Integer integer : hashMap.keySet()) {
            if (hashMap.get(integer).getName().equals(next)) {
                System.out.println("编号: " + hashMap.get(integer).getID() + "," +
                        "名称: " + hashMap.get(integer).getName() + ", " +
                        "单价: " + hashMap.get(integer).getPrice() + ", " +
                        "出版社: " + hashMap.get(integer).getPress());
                break;
            } else {
                System.out.println("没有这件商品哟！");
            }
        }
    }
}


//测试
class show {
    public static void main(String[] args) {
        /*Scanner scanner = new Scanner(System.in);
        HashMap<Integer, Commodity> hashMap = new HashMap<>();

        a:
        while (true) {
            String next1 = scanner.nextLine();
            String[] split = next1.split(",|\\s+|，");
            for (int i = 0; i < split.length; i++) {
                if (split[i].equals("0")) {
                    break a;
                } else {
                    Commodity commodity = new Commodity(Integer.parseInt(split[0]), split[1], Double.parseDouble(split[2]), split[3]);
                    hashMap.put(commodity.getID(), commodity);
                    break;
                }
            }

        }*/
//        LamadaOnlyOutput(hashMap);


        // lamada 遍历
       /* hashMap.forEach((k, v) -> System.out.println("编号: " + k + "," +
                "名称: " + v.getName() + ", " +
                "单价: " + v.getPrice() + ", " +
                "出版社: " + v.getPress()));*/


//        ShowInput(hashMap);


//        getAll(hashMap);
    }

    /*private static void LamadaOnlyOutput(HashMap<Integer, Commodity> hashMap) {
        System.out.println("请输入需要查询的商品：");
        Scanner scanner1 = new Scanner(System.in);
        String next = scanner1.next();
        hashMap.forEach((k, v) -> {
            if (v.getName().equals(next)) {
                System.out.println(v.getID() + " " + v.getName() + " " + v.getPrice() + " " + v.getPress());
                return;
            } else {
                System.out.println("不存在这件商品哟");
            }
        });
    }*/

    /*private static void ShowInput(HashMap<Integer, Commodity> hashMap) {
        System.out.println("请输入需要查询的商品：");
        Scanner scanner1 = new Scanner(System.in);
        String next = scanner1.next();
        for (Integer integer : hashMap.keySet()) {
            if (hashMap.get(integer).getName().equals(next)) {
                System.out.println("编号: " + hashMap.get(integer).getID() + "," +
                        "名称: " + hashMap.get(integer).getName() + ", " +
                        "单价: " + hashMap.get(integer).getPrice() + ", " +
                        "出版社: " + hashMap.get(integer).getPress());
                break;
            } else {
                System.out.println("没有这件商品哟！");
            }
        }
    }*/

    /*private static void getAll(HashMap<Integer, Commodity> hashMap) {
        Iterator<Integer> iterator = hashMap.keySet().iterator();
        while (iterator.hasNext()) {
            Integer next = iterator.next();
            System.out.println("编号: " + hashMap.get(next).getID() + "," +
                    "名称: " + hashMap.get(next).getName() + ", " +
                    "单价: " + hashMap.get(next).getPrice() + ", " +
                    "出版社: " + hashMap.get(next).getPress());
        }
    }*/

}

