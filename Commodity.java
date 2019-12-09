package Day14;

public class Commodity {
    private int ID;
    private String name;
    private double price;
    private String press;

    public Commodity() {
    }

    public Commodity(int ID, String name, double price, String press) {
        setID(ID);
        setName(name);
        setPrice(price);
        setPress(press);
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getPress() {
        return press;
    }

    public void setPress(String press) {
        this.press = press;
    }
}
